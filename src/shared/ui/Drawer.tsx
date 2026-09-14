'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { X as CloseIcon } from 'lucide-react';
import React from 'react';

export interface DrawerProps extends Omit<MuiDrawerProps, 'children'> {
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: number | string;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  width = 420,
  anchor = 'right',
  ...props
}: DrawerProps) {
  return (
    <MuiDrawer
      open={open}
      onClose={onClose}
      anchor={anchor}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(3px)' },
        },
        paper: {
          sx: {
            width: { xs: '100%', sm: width },
            boxShadow: '-4px 0 24px rgba(15, 23, 42, 0.12)',
          },
        },
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {Boolean(title || onClose) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: '20px 24px',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box>
              {title && (
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
              <CloseIcon size={20} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>{children}</Box>

        {actions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1.5,
              p: '16px 24px',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </MuiDrawer>
  );
}
