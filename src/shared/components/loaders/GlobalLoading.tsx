'use client';

import Box from '@mui/material/Box';
import React from 'react';
import { LinearProgress } from './LinearProgress';

export interface GlobalLoadingProps {
  isLoading?: boolean;
}

export function GlobalLoading({ isLoading = true }: GlobalLoadingProps) {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        width: '100%',
      }}
    >
      <LinearProgress height={3} gradient />
    </Box>
  );
}

export default GlobalLoading;
