'use client';

import { getQueryClient } from '@/core/api/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
