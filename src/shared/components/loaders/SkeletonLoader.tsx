'use client';

import Box from '@mui/material/Box';
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import React from 'react';

export type SkeletonType = 'text' | 'avatar' | 'card' | 'table' | 'form' | 'chart';

export interface SkeletonLoaderProps extends SkeletonProps {
  type?: SkeletonType;
  count?: number;
}

export function SkeletonLoader({ type = 'text', count = 1, sx, ...props }: SkeletonLoaderProps) {
  if (type === 'avatar') {
    return (
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        animation="wave"
        sx={sx}
        {...props}
      />
    );
  }

  if (type === 'card') {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: '16px',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Skeleton variant="text" width="60%" height={32} animation="wave" />
        <Skeleton variant="text" width="40%" height={20} animation="wave" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px' }} animation="wave" />
      </Box>
    );
  }

  if (type === 'table') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              px: 2,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Skeleton variant="circular" width={36} height={36} animation="wave" />
            <Skeleton variant="text" width="30%" animation="wave" />
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton variant="text" width="20%" animation="wave" />
          </Box>
        ))}
      </Box>
    );
  }

  if (type === 'form') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '10px' }} animation="wave" />
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: '10px' }} animation="wave" />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: '10px' }} animation="wave" />
      </Box>
    );
  }

  if (type === 'chart') {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: '16px',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
      >
        <Skeleton variant="text" width="30%" height={28} animation="wave" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={240} sx={{ borderRadius: '12px' }} animation="wave" />
      </Box>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton
          key={idx}
          variant="rounded"
          animation="wave"
          sx={{ borderRadius: '8px', ...sx }}
          {...props}
        />
      ))}
    </>
  );
}

export default SkeletonLoader;
