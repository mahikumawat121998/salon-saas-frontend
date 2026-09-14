'use client';

import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import React from 'react';

export interface LoaderProps extends CircularProgressProps {
  fullPage?: boolean;
}

export function Loader({ fullPage = false, size = 40, sx, ...props }: LoaderProps) {
  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          width: '100%',
        }}
      >
        <CircularProgress size={size} sx={sx} {...props} />
      </Box>
    );
  }

  return <CircularProgress size={size} sx={sx} {...props} />;
}
