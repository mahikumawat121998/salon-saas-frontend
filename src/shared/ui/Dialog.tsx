'use client';

import MuiButton from '@mui/material/Button';
import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import MuiDialogActions from '@mui/material/DialogActions';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import MuiDialogTitle from '@mui/material/DialogTitle';
import React from 'react';

export interface ConfirmDialogProps extends Omit<MuiDialogProps, 'children'> {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function Dialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  loading = false,
  ...props
}: ConfirmDialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={onCancel}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
            maxWidth: 440,
          },
        },
      }}
      {...props}
    >
      <MuiDialogTitle sx={{ fontWeight: 700 }}>{title}</MuiDialogTitle>
      <MuiDialogContent>
        <MuiDialogContentText>{description}</MuiDialogContentText>
      </MuiDialogContent>
      <MuiDialogActions sx={{ p: '16px 24px', gap: 1 }}>
        <MuiButton onClick={onCancel} disabled={loading} color="inherit">
          {cancelText}
        </MuiButton>
        <MuiButton
          onClick={onConfirm}
          disabled={loading}
          color={confirmColor}
          variant="contained"
          sx={{ borderRadius: '10px' }}
        >
          {confirmText}
        </MuiButton>
      </MuiDialogActions>
    </MuiDialog>
  );
}
