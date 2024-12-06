import { QueryClient } from 'react-query';
import { createApiClient } from './shared/api/apiClient';

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
});

export default new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});
