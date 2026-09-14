'use client';

import Box from '@mui/material/Box';
import MuiLinearProgress, { LinearProgressProps as MuiLinearProgressProps } from '@mui/material/LinearProgress';
import React from 'react';

export interface LinearProgressProps extends MuiLinearProgressProps {
  height?: number;
  gradient?: boolean;
}

export function LinearProgress({
  height = 4,
  gradient = true,
  sx,
  ...props
}: LinearProgressProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <MuiLinearProgress
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(124, 58, 237, 0.12)'
              : 'rgba(139, 92, 246, 0.24)',
          ...(gradient && {
            '& .MuiLinearProgress-bar': {
              borderRadius: height / 2,
              background: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)',
            },
          }),
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
}

export default LinearProgress;
