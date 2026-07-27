'use client';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </MuiLocalizationProvider>
  );
}
