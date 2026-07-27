'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuiModal, { ModalProps as MuiModalProps } from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { X as CloseIcon } from 'lucide-react';
import React from 'react';

export interface ModalProps extends Omit<MuiModalProps, 'children'> {
  title?: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: number | string;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 560,
  ...props
}: ModalProps) {
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backdropFilter: 'blur(4px)',
      }}
      {...props}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth,
          backgroundColor: 'background.paper',
          borderRadius: '16px',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0px 20px 40px rgba(15, 23, 42, 0.16)'
              : '0px 20px 40px rgba(0, 0, 0, 0.6)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          outline: 'none',
          overflow: 'hidden',
        }}
      >
        {Boolean(title || onClose) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: '20px 24px 16px',
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

        <Box sx={{ p: 3, maxHeight: '70vh', overflowY: 'auto' }}>{children}</Box>

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
    </MuiModal>
  );
}
