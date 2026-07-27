import { QueryClient } from '@tanstack/react-query';
import { queryDefaultOptions } from './defaultOptions';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: queryDefaultOptions,
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

export const queryClient = getQueryClient();
export default queryClient;
