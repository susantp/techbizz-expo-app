import { queryOptions } from '@tanstack/react-query';

import { fetchCompanyContent, fetchPersonalContent } from './request';

const sessionQueryPolicy = {
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false,
  retryOnMount: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  networkMode: 'always' as const,
};

export const companyContentQuery = queryOptions({
  queryKey: ['portfolio', 'company'] as const,
  queryFn: ({ signal }) => fetchCompanyContent(signal),
  ...sessionQueryPolicy,
});

export const personalContentQuery = queryOptions({
  queryKey: ['portfolio', 'personal'] as const,
  queryFn: ({ signal }) => fetchPersonalContent(signal),
  ...sessionQueryPolicy,
});
