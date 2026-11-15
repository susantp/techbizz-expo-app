import { useCallback } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { CompanyContent, PersonalContent } from './model';
import { companyContentQuery, personalContentQuery } from './queries';

type ContentStatus = 'idle' | 'loading' | 'ready' | 'error';
type ContentState<T> = { data: T | undefined; status: ContentStatus; error: Error | undefined; retry: () => void };

function useContentState<T>(query: UseQueryResult<T, Error>): ContentState<T> {
  const { refetch } = query;
  const retry = useCallback(() => {
    void refetch({ cancelRefetch: false });
  }, [refetch]);

  let status: ContentStatus = 'idle';
  if (query.isFetching) status = 'loading';
  else if (query.isError) status = 'error';
  else if (query.data !== undefined) status = 'ready';

  return {
    data: query.data,
    status,
    error: status === 'error' ? query.error ?? undefined : undefined,
    retry,
  };
}

export function useCompanyContent(): ContentState<CompanyContent> {
  const query = useQuery({ ...companyContentQuery, enabled: false });
  return useContentState(query);
}

export function usePersonalContent(enabled: boolean): ContentState<PersonalContent> {
  const query = useQuery({ ...personalContentQuery, enabled });
  return useContentState(query);
}
