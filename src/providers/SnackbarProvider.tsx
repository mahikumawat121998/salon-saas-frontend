'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { useColorMode } from './ThemeProvider';

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const { mode } = useColorMode();

  return (
    <>
      {children}
      <Toaster
        theme={mode}
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontFamily: 'inherit',
          },
        }}
      />
    </>
  );
}
