'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApiService } from '@/services/api/inventory.service';
import { QUERY_KEYS } from '@/config/query-keys';

interface AddInventoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddInventoryModal({ open, onClose }: AddInventoryModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Hair Care',
    brand: '',
    stock: 0,
    unit: '',
    price: '',
    purchasePrice: '',
    sellingPrice: '',
    status: 'In Stock',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => inventoryApiService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      setFormData({
        name: '',
        sku: '',
        category: 'Hair Care',
        brand: '',
        stock: 0,
        unit: '',
        price: '',
        purchasePrice: '',
        sellingPrice: '',
        status: 'In Stock',
      });
      onClose();
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        Add New Product
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ border: 'none' }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Product Name *</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>SKU *</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Brand</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Category *</Typography>
            <Select
              fullWidth
              size="small"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="Hair Care">Hair Care</MenuItem>
              <MenuItem value="Skin Care">Skin Care</MenuItem>
              <MenuItem value="Nail Care">Nail Care</MenuItem>
              <MenuItem value="Equipment">Equipment</MenuItem>
            </Select>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Status</Typography>
            <Select
              fullWidth
              size="small"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Stock Quantity</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Unit (e.g., 250ml, 1 pc)</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Unit Price</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Purchase Price</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block' }}>Selling Price</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => createMutation.mutate(formData)}
          disabled={createMutation.isPending || !formData.name || !formData.sku}
          sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}
        >
          {createMutation.isPending ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
