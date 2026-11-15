import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { companyContentQuery, personalContentQuery } from './queries';

function PortfolioQueryObservers() {
  const queryClient = useQueryClient();

  useQuery({ ...companyContentQuery, enabled: false });
  useQuery({ ...personalContentQuery, enabled: false });

  useEffect(() => { void queryClient.prefetchQuery(companyContentQuery); }, [queryClient]);

  return null;
}

export function PortfolioQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioQueryObservers />
      {children}
    </QueryClientProvider>
  );
}
