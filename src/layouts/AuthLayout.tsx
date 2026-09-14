'use client';

import { useColorMode } from '@/providers/ThemeProvider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Moon, Scissors, Sun } from 'lucide-react';
import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: 'background.default',
        p: 2,
        backgroundImage: (theme) =>
          theme.palette.mode === 'light'
            ? 'radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.08) 0px, transparent 50%)'
            : 'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(244, 114, 182, 0.15) 0px, transparent 50%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>
      </Box>

      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: '24px',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0px 20px 40px rgba(15, 23, 42, 0.08)'
              : '0px 20px 40px rgba(0, 0, 0, 0.5)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0px 8px 16px rgba(124, 58, 237, 0.25)',
            }}
          >
            <Scissors size={28} />
          </Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            {title || 'Welcome to SalonOS'}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {children}
      </Card>
    </Box>
  );
}

export default AuthLayout;
