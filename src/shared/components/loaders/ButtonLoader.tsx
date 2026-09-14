'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface ButtonLoaderProps {
  size?: number;
  text?: string;
  color?: 'inherit' | 'primary' | 'secondary';
}

export function ButtonLoader({ size = 18, text, color = 'inherit' }: ButtonLoaderProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={size} color={color} thickness={4} />
      {text && (
        <Typography variant="body2" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
          {text}
        </Typography>
      )}
    </Box>
  );
}

export default ButtonLoader;
