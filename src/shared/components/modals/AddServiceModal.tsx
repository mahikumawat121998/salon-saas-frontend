'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { X } from 'lucide-react';

export interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (serviceData: any) => void;
}

export function AddServiceModal({ open, onClose, onSave }: AddServiceModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '1.05rem' }}>
        Add New Service
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ border: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
            Service Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter service name"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
            Category
          </Typography>
          <Select fullWidth size="small" defaultValue="" displayEmpty sx={{ borderRadius: '10px' }}>
            <MenuItem value="" disabled>Select category</MenuItem>
            <MenuItem value="hair">Hair Care</MenuItem>
            <MenuItem value="skin">Skin Care</MenuItem>
            <MenuItem value="nails">Nail Care</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
            Duration
          </Typography>
          <Select fullWidth size="small" defaultValue="" displayEmpty sx={{ borderRadius: '10px' }}>
            <MenuItem value="" disabled>Select duration</MenuItem>
            <MenuItem value="30">30 min</MenuItem>
            <MenuItem value="45">45 min</MenuItem>
            <MenuItem value="60">60 min</MenuItem>
            <MenuItem value="90">90 min</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.8, color: '#374151' }}>
            Price
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="$ 0.00"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (onSave) onSave({});
            onClose();
          }}
          sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
        >
          Save Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}
