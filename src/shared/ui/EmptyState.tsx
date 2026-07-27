'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FolderOpen } from 'lucide-react';
import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        borderRadius: '16px',
        border: (theme) => `1px dashed ${theme.palette.divider}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.5)' : 'rgba(30, 41, 59, 0.5)',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '18px',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(124, 58, 237, 0.08)'
              : 'rgba(139, 92, 246, 0.16)',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon || <FolderOpen size={32} />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400, mb: actionText ? 3 : 0 }}
        >
          {description}
        </Typography>
      )}

      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} sx={{ borderRadius: '10px' }}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}
