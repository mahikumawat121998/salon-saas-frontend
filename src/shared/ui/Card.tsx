'use client';

import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import MuiCardActions, { CardActionsProps } from '@mui/material/CardActions';
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent';
import MuiCardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import React from 'react';

export interface CardProps extends MuiCardProps {
  hoverable?: boolean;
  glassmorphic?: boolean;
}

export function Card({ hoverable = false, glassmorphic = false, sx, children, ...props }: CardProps) {
  return (
    <MuiCard
      sx={{
        ...(hoverable && {
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'light'
                ? '0px 12px 28px rgba(15, 23, 42, 0.12)'
                : '0px 12px 28px rgba(0, 0, 0, 0.6)',
          },
        }),
        ...(glassmorphic && {
          backdropFilter: 'blur(12px)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.75)'
              : 'rgba(30, 41, 59, 0.75)',
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}

export function CardHeader(props: CardHeaderProps) {
  return <MuiCardHeader {...props} />;
}

export function CardContent(props: CardContentProps) {
  return <MuiCardContent {...props} />;
}

export function CardActions(props: CardActionsProps) {
  return <MuiCardActions {...props} />;
}
