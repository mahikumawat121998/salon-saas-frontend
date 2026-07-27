'use client';

import Box from '@mui/material/Box';
import React from 'react';

export interface BlankLayoutProps {
  children: React.ReactNode;
}

export function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  );
}

export default BlankLayout;
