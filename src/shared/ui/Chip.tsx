'use client';

import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';
import React from 'react';

export type StatusVariant =
  | 'completed'
  | 'confirmed'
  | 'pending'
  | 'in-progress'
  | 'cancelled'
  | 'no-show';

export interface ChipProps extends MuiChipProps {
  status?: StatusVariant;
}

const statusStyles: Record<StatusVariant, { bg: string; color: string }> = {
  completed: { bg: 'rgba(16, 185, 129, 0.12)', color: '#047857' },
  confirmed: { bg: 'rgba(59, 130, 246, 0.12)', color: '#1D4ED8' },
  pending: { bg: 'rgba(245, 158, 11, 0.12)', color: '#B45309' },
  'in-progress': { bg: 'rgba(124, 58, 237, 0.12)', color: '#5B21B6' },
  cancelled: { bg: 'rgba(239, 68, 68, 0.12)', color: '#B91C1C' },
  'no-show': { bg: 'rgba(148, 163, 184, 0.16)', color: '#475569' },
};

export function Chip({ status, sx, ...props }: ChipProps) {
  const customSx = status
    ? {
        backgroundColor: statusStyles[status].bg,
        color: statusStyles[status].color,
        fontWeight: 600,
        borderRadius: '6px',
        ...sx,
      }
    : {
        fontWeight: 500,
        borderRadius: '6px',
        ...sx,
      };

  return <MuiChip size="small" sx={customSx} {...props} />;
}
