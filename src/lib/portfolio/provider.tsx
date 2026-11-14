import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { requestPortfolio } from './request';
import type { PortfolioSource } from './config';
import type { PortfolioContent } from './model';

type Status = 'idle' | 'loading' | 'ready' | 'error';
type Entry<T> = { data?: T; status: Status; error?: Error };
type PortfolioState = { [Source in PortfolioSource]: Entry<PortfolioContent[Source]> };
type PortfolioContextValue = {
  state: PortfolioState;
  load: (source: PortfolioSource) => Promise<void>;
};

const initialState: PortfolioState = {
  company: { status: 'idle' },
  personal: { status: 'idle' },
};
const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const inFlight = useRef<Partial<Record<PortfolioSource, Promise<void>>>>({});
  const controllers = useRef<Partial<Record<PortfolioSource, AbortController>>>({});

  const load = useCallback((source: PortfolioSource) => {
    const pending = inFlight.current[source];
    if (pending) return pending;
    setState(current => ({ ...current, [source]: { ...current[source], status: 'loading', error: undefined } }));
    const controller = new AbortController();
    controllers.current[source] = controller;
    const task = requestPortfolio(source, controller.signal)
      .then(result => {
        if (controllers.current[source] !== controller) return;
        setState(current => {
          if (result.source === 'company') {
            return { ...current, company: { data: result.data, status: 'ready' } };
          }
          return { ...current, personal: { data: result.data, status: 'ready' } };
        });
      })
      .catch(error => {
        if (controllers.current[source] !== controller) return;
        setState(current => ({ ...current, [source]: { data: current[source].data, status: 'error', error: error instanceof Error ? error : new Error('Request failed') } }));
      })
      .finally(() => {
        if (inFlight.current[source] === task) delete inFlight.current[source];
      });
    inFlight.current[source] = task;
    return task;
  }, []);

  useEffect(() => { void load('company'); }, [load]);
  useEffect(() => () => {
    Object.values(controllers.current).forEach(controller => controller?.abort());
    controllers.current = {};
    inFlight.current = {};
  }, []);

  const value = useMemo(() => ({ state, load }), [state, load]);
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

function usePortfolio() {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error('Portfolio hooks require PortfolioProvider');
  return value;
}

export function useCompanyContent() {
  const { state, load } = usePortfolio();
  return { ...state.company, retry: () => load('company') };
}

export function usePersonalContent(enabled: boolean) {
  const { state, load } = usePortfolio();
  useEffect(() => { if (enabled) void load('personal'); }, [enabled, load]);
  return { ...state.personal, retry: () => load('personal') };
}
