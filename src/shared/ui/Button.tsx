'use client';

import CircularProgress from '@mui/material/CircularProgress';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import React from 'react';

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading = false, disabled, icon, startIcon, ...props }, ref) => {
    return (
      <MuiButton
        ref={ref}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon || icon}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
