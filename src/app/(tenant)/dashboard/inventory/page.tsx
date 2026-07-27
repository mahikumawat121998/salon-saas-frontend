'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import {
  Package,
  Truck,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  X,
  Copy,
  Edit2,
  Trash2,
  Check,
  Calendar,
  Tag,
  Barcode,
  Layers,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { AddInventoryModal } from '@/shared/components/modals/AddInventoryModal';
import { EditInventoryModal } from '@/shared/components/modals/EditInventoryModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApiService, InventoryProduct } from '@/services/api/inventory.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { TableRowSkeleton } from '@/shared/components/loaders';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: inventoryList = [], isLoading: isInventoryLoading } = useQuery({
    queryKey: QUERY_KEYS.inventory.all,
    queryFn: () => inventoryApiService.getInventory(),
  });

  const displayList = inventoryList;

  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  
  // Set default selected product once data loads
  React.useEffect(() => {
    if (inventoryList.length > 0 && !selectedProduct) {
      setSelectedProduct(inventoryList[0]);
    }
  }, [inventoryList, selectedProduct]);

  const [copiedBarcode, setCopiedBarcode] = useState<boolean>(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryApiService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      setSelectedProduct(null); // Clear selection since it's deleted
    },
  });

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  // Status Chip Helper
  const getStatusChipProps = (status: InventoryProduct['status']) => {
    switch (status) {
      case 'In Stock':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981' };
      case 'Low Stock':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' };
      case 'Out of Stock':
        return { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const handleCopyBarcode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBarcode(true);
    setTimeout(() => setCopiedBarcode(false), 2000);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title & Right Action Controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <PageHeader
              title="Inventory"
              subtitle="Manage your salon inventory, track stock and receive low stock alerts."
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Filter size={16} />}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  py: 0.9,
                  px: 2,
                  textTransform: 'none',
                }}
              >
                Filter
              </Button>

              <Select
                size="small"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ borderRadius: '12px', fontSize: '0.84rem', height: 40, minWidth: 140 }}
              >
                <MenuItem value="all">Categories</MenuItem>
                <MenuItem value="hair_care">Hair Care</MenuItem>
                <MenuItem value="hair_treatment">Hair Treatment</MenuItem>
                <MenuItem value="skin_care">Skin Care</MenuItem>
                <MenuItem value="nail_care">Nail Care</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
              </Select>

              <TextField
                placeholder="Search inventory..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: 220,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.84rem',
                    height: 40,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  py: 1,
                  px: 2.5,
                  textTransform: 'none',
                  boxShadow: '0px 4px 14px rgba(124, 58, 237, 0.25)',
                  '&:hover': { backgroundColor: '#6D28D9' },
                }}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add New Product
              </Button>
            </Box>
          </Box>

          {/* Top 4 Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3.5 }}>
            {/* Card 1: Total Products */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: '#F3E8FF',
                        color: '#7C3AED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Package size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Total Products
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                        256
                      </Typography>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                        <ArrowUpRight size={12} /> 12.5% vs last month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2: In Stock */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: '#ECFDF5',
                        color: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Truck size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        In Stock
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                        198
                      </Typography>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                        <ArrowUpRight size={12} /> 8.3% vs last month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: Low Stock */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: '#FFF7ED',
                        color: '#F97316',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AlertTriangle size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Low Stock
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                        32
                      </Typography>
                      <Typography variant="caption" color="error.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                        <ArrowDownRight size={12} /> 15.6% vs last month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 4: Out of Stock */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card sx={{ borderRadius: '20px', p: 2.5, border: '1px solid #F3F4F6', boxShadow: '0px 2px 8px rgba(0,0,0,0.03)' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: '#FEE2E2',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <XCircle size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Out of Stock
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1, mt: 0.2 }}>
                        26
                      </Typography>
                      <Typography variant="caption" color="error.main" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                        <ArrowDownRight size={12} /> 5.2% vs last month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main 2-Column Section: Table (Left 68%) & Side Panel (Right 32%) */}
          <Grid container spacing={3}>
            {/* Left Data Table Column */}
            <Grid size={{ xs: 12, lg: 7.5, xl: 8 }}>
              <Card sx={{ borderRadius: '20px', border: '1px solid #F3F4F6', p: 2.5, backgroundColor: '#FFFFFF' }}>
                {/* Filter Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs
                    value={selectedTab}
                    onChange={(_, val) => setSelectedTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        minWidth: 'auto',
                        px: 2,
                      },
                    }}
                  >
                    <Tab label="All Products" />
                    <Tab label="In Stock" />
                    <Tab label="Low Stock" />
                    <Tab label="Out of Stock" />
                  </Tabs>
                </Box>

                {/* Products Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 1.2 } }}>
                        <TableCell padding="checkbox">
                          <Checkbox size="small" />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Brand</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Stock</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Unit Price</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#6B7280', fontSize: '0.75rem' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isInventoryLoading ? (
                        <TableRowSkeleton columns={8} rows={5} hasAvatar={true} />
                      ) : displayList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                            <Typography variant="body2" color="text.secondary">No inventory found.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : displayList.map((prod) => {
                        const isSelected = selectedProduct?.id === prod.id;
                        const statusStyle = getStatusChipProps(prod.status);

                        return (
                          <TableRow
                            key={prod.id}
                            hover
                            onClick={() => setSelectedProduct(prod)}
                            selected={isSelected}
                            sx={{
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.03)' : 'transparent',
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox size="small" checked={isSelected} />
                            </TableCell>

                            {/* Product Info */}
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  component="img"
                                  src={prod.image}
                                  alt={prod.name}
                                  sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                    border: '1px solid #E5E7EB',
                                  }}
                                />
                                <Box>
                                  <Typography variant="subtitle2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
                                    {prod.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                                    SKU: {prod.sku}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            {/* Category Chip */}
                            <TableCell>
                              <Chip
                                label={prod.category}
                                size="small"
                                sx={{
                                  backgroundColor: prod.categoryBg,
                                  color: prod.categoryColor,
                                  fontWeight: 700,
                                  fontSize: '0.6875rem',
                                  height: 20,
                                  borderRadius: '6px',
                                }}
                              />
                            </TableCell>

                            {/* Brand */}
                            <TableCell sx={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 500 }}>
                              {prod.brand}
                            </TableCell>

                            {/* Stock */}
                            <TableCell>
                              <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                                {prod.stock}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', display: 'block' }}>
                                {prod.unit}
                              </Typography>
                            </TableCell>

                            {/* Unit Price */}
                            <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                              {prod.price}
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                              <Chip
                                label={prod.status}
                                size="small"
                                sx={{
                                  backgroundColor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 700,
                                  fontSize: '0.6875rem',
                                  height: 20,
                                  borderRadius: '6px',
                                }}
                              />
                            </TableCell>

                            {/* Actions */}
                            <TableCell align="right">
                              <IconButton size="small">
                                <MoreVertical size={16} color="#9CA3AF" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Table Footer & Pagination */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pt: 2.5,
                    mt: 1,
                    borderTop: '1px solid #F3F4F6',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Showing 1 to 8 of 256 products
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Pagination count={32} page={1} size="small" color="primary" />
                    <Select size="small" defaultValue={10} sx={{ height: 28, fontSize: '0.75rem', borderRadius: '6px' }}>
                      <MenuItem value={10}>10 / page</MenuItem>
                      <MenuItem value={20}>20 / page</MenuItem>
                    </Select>
                  </Box>
                </Box>
              </Card>

              {/* Bottom Stock Alert Banner */}
              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  borderRadius: '16px',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AlertTriangle size={20} color="#F59E0B" />
                  <Typography variant="body2" color="#92400E" sx={{ fontWeight: 700, fontSize: '0.84rem' }}>
                    32 products are running low on stock.
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#FDE68A',
                    color: '#92400E',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#FEF3C7',
                    },
                  }}
                >
                  View Low Stock
                </Button>
              </Box>
            </Grid>

            {/* Right Side: Product Details Side Panel (32%) */}
            <Grid size={{ xs: 12, lg: 4.5, xl: 4 }}>
              <Card
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #F3F4F6',
                  p: 3,
                  backgroundColor: '#FFFFFF',
                  position: 'sticky',
                  top: 90,
                }}
              >
                {/* Close Button Header */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <IconButton size="small">
                    <X size={18} color="#9CA3AF" />
                  </IconButton>
                </Box>

                {!selectedProduct ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">Select a product to view details.</Typography>
                  </Box>
                ) : (
                  <>

                {/* Product Image & Title */}
                <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                  <Box
                    component="img"
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '16px',
                      objectFit: 'cover',
                      mx: 'auto',
                      mb: 2,
                      border: '1px solid #E5E7EB',
                      boxShadow: '0px 4px 14px rgba(0,0,0,0.06)',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                    {selectedProduct.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 0.8 }}>
                    <Chip
                      label={selectedProduct.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusChipProps(selectedProduct.status).bg,
                        color: getStatusChipProps(selectedProduct.status).color,
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        height: 20,
                      }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mt: 0.8 }}>
                    SKU: {selectedProduct.sku} • {selectedProduct.category}
                  </Typography>
                </Box>

                {/* 4 Metric Box Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    backgroundColor: '#FAFAFC',
                    borderRadius: '14px',
                    p: 1.5,
                    textAlign: 'center',
                    mb: 3,
                    border: '1px solid #F3F4F6',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>
                      {selectedProduct.stock}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      Current Stock
                    </Typography>
                  </Box>

                  <Box sx={{ borderLeft: '1px solid #E5E7EB' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>
                      {selectedProduct.reorderLevel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      Reorder Level
                    </Typography>
                  </Box>

                  <Box sx={{ borderLeft: '1px solid #E5E7EB' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>
                      {selectedProduct.unit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      Unit Size
                    </Typography>
                  </Box>

                  <Box sx={{ borderLeft: '1px solid #E5E7EB' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>
                      {selectedProduct.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      Unit Price
                    </Typography>
                  </Box>
                </Box>

                {/* Detail Sub Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
                  <Tabs
                    value={0}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        minWidth: 'auto',
                        px: 2,
                      },
                    }}
                  >
                    <Tab label="Details" />
                    <Tab label="History" />
                    <Tab label="Suppliers" />
                  </Tabs>
                </Box>

                {/* Key-Value Details Grid */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Category
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                      {selectedProduct.category}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Brand
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                      {selectedProduct.brand}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Barcode
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                        {selectedProduct.barcode}
                      </Typography>
                      <IconButton size="small" onClick={() => handleCopyBarcode(selectedProduct.barcode || '')}>
                        {copiedBarcode ? <Check size={14} color="#10B981" /> : <Copy size={14} color="#9CA3AF" />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Unit
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                      {selectedProduct.unit}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Purchase Price
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                      {selectedProduct.purchasePrice}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Selling Price
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                      {selectedProduct.sellingPrice}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                      Expiry Date
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                      {selectedProduct.expiryDate}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem', display: 'block', mb: 0.5 }}>
                      Description
                    </Typography>
                    <Typography variant="body2" color="#374151" sx={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                      {selectedProduct.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                      Added On
                    </Typography>
                    <Typography variant="caption" color="#4B5563" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
                      {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : ''}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                      Last Updated
                    </Typography>
                    <Typography variant="caption" color="#4B5563" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
                      {selectedProduct.updatedAt ? new Date(selectedProduct.updatedAt).toLocaleDateString() : ''}
                    </Typography>
                  </Box>
                </Box>

                {/* Bottom Action Buttons */}
                <Grid container spacing={1.5}>
                  <Grid size={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setIsEditModalOpen(true)}
                      startIcon={<Edit2 size={16} />}
                      sx={{
                        borderRadius: '12px',
                        borderColor: '#E5E7EB',
                        color: '#374151',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        textTransform: 'none',
                        py: 0.9,
                      }}
                    >
                      Edit Product
                    </Button>
                  </Grid>

                  <Grid size={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleDeleteProduct(selectedProduct.id)}
                      disabled={deleteMutation.isPending}
                      startIcon={<Trash2 size={16} color="#EF4444" />}
                      sx={{
                        borderRadius: '12px',
                        borderColor: '#FEE2E2',
                        color: '#EF4444',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        textTransform: 'none',
                        py: 0.9,
                        '&:hover': {
                          backgroundColor: '#FEF2F2',
                        },
                      }}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete Product'}
                    </Button>
                  </Grid>
                </Grid>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        <AddInventoryModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
        
        <EditInventoryModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
