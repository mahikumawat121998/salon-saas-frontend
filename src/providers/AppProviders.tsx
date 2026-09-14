'use client';

import React from 'react';
import { AuthProvider } from './AuthProvider';
import { LocalizationProvider } from './LocalizationProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { SnackbarProvider } from './SnackbarProvider';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <LocalizationProvider>
        <ThemeProvider>
          <SnackbarProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </ReactQueryProvider>
  );
}
export { AppProviders };
