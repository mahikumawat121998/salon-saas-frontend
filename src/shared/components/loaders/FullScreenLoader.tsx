'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Scissors } from 'lucide-react';
import React from 'react';

export interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({ message = 'Loading Salon Suite...' }: FullScreenLoaderProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'background.default',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: (theme) =>
          theme.palette.mode === 'light'
            ? 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <CircularProgress
          size={72}
          thickness={3}
          sx={{
            color: 'primary.main',
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
          <Scissors size={28} />
        </Box>
      </Box>

      <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
        SalonOS
      </Typography>

      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default FullScreenLoader;
