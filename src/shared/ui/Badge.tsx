'use client';

import MuiBadge, { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';
import React from 'react';

export interface BadgeProps extends MuiBadgeProps {
  pulse?: boolean;
}

export function Badge({ pulse = false, sx, children, ...props }: BadgeProps) {
  return (
    <MuiBadge
      sx={{
        ...(pulse && {
          '& .MuiBadge-badge': {
            '&::after': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: 'ripple 1.2s infinite ease-in-out',
              border: '1px solid currentColor',
              content: '""',
            },
          },
          '@keyframes ripple': {
            '0%': {
              transform: 'scale(.8)',
              opacity: 1,
            },
            '100%': {
              transform: 'scale(2.4)',
              opacity: 0,
            },
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBadge>
  );
}
