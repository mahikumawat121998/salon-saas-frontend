'use client';
// Force Next.js recompile

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { Avatar } from '@/shared/ui/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Ban,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Filter,
  Layers,
  MoreVertical,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
  Percent,
} from 'lucide-react';
import React, { useState } from 'react';

import { catalogApiService, ServiceItem, ServiceCategory, CreateServiceDto, UpdateServiceDto } from '@/services/api/catalog.service';
import { QUERY_KEYS } from '@/config/query-keys';

import { staffApiService } from '@/services/api/staff.service';
import { TableRowSkeleton } from '@/shared/components/loaders';

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Create / Edit Service Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDuration, setFormDuration] = useState<number>(30);
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formTax, setFormTax] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [formCommission, setFormCommission] = useState('');
  const [formStaffIds, setFormStaffIds] = useState<string[]>([]);
  
  // Category Modal State
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // ----------------------------------------------------------------------
  // API Hooks
  // ----------------------------------------------------------------------
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: QUERY_KEYS.services.categories,
    queryFn: catalogApiService.getCategories,
  });

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: QUERY_KEYS.services.all,
    queryFn: catalogApiService.getServices,
  });

  const { data: staffList = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: QUERY_KEYS.staff.all,
    queryFn: staffApiService.getStaff,
  });

  // Service Mutations
  const createServiceMutation = useMutation({
    mutationFn: catalogApiService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services.all });
      setOpenAddModal(false);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceDto }) => catalogApiService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services.all });
      setOpenAddModal(false);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: catalogApiService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services.all });
    },
  });

  // Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: catalogApiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services.categories });
      setOpenCategoryModal(false);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) => catalogApiService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services.categories });
      setOpenCategoryModal(false);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: catalogApiService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services.categories });
    },
  });

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setFormName('');
    setFormCategoryId(categories[0]?.id || '');
    setFormDuration(30);
    setFormPrice(0);
    setFormTax(0);
    setFormStatus('ACTIVE');
    setFormCommission('');
    setFormStaffIds([]);
    setOpenAddModal(true);
  };

  const handleOpenEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setFormName(service.name);
    setFormCategoryId(service.categoryId);
    setFormDuration(service.durationMinutes);
    setFormPrice(service.price);
    setFormTax(service.tax || 0);
    setFormStatus(service.status);
    setFormCommission(service.commissionRule || '');
    setFormStaffIds(service.staff?.map(s => s.staffId) || []);
    setOpenAddModal(true);
  };

  const handleSaveService = () => {
    const data: CreateServiceDto = {
      name: formName,
      categoryId: formCategoryId,
      durationMinutes: Number(formDuration),
      price: Number(formPrice),
      tax: Number(formTax),
      status: formStatus,
      commissionRule: formCommission,
      eligibleStaffIds: formStaffIds,
    };

    if (editingServiceId) {
      updateServiceMutation.mutate({ id: editingServiceId, data });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleOpenCategory = (cat?: ServiceCategory) => {
    if (cat) {
      setEditingCategoryId(cat.id);
      setCategoryName(cat.name);
    } else {
      setEditingCategoryId(null);
      setCategoryName('');
    }
    setOpenCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategoryId) {
      updateCategoryMutation.mutate({ id: editingCategoryId, data: { name: categoryName } });
    } else {
      createCategoryMutation.mutate({ name: categoryName });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category? (Ensure no services are attached)')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', pb: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                Service Menu
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Manage your salon services, pricing, and category structures
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleOpenCategory()}
                startIcon={<Layers size={18} />}
                sx={{
                  borderRadius: '12px',
                  borderColor: '#E5E7EB',
                  color: '#374151',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2.5,
                }}
              >
                Categories
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenAddService}
                startIcon={<Plus size={18} />}
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#7C3AED',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2.5,
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                  '&:hover': { backgroundColor: '#6D28D9' }
                }}
              >
                Add Service
              </Button>
            </Box>
          </Box>

          {/* Sub Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={(_, val) => setSelectedTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem' } }}
            >
              <Tab label="All Services" />
              <Tab label="Categories" />
            </Tabs>
          </Box>

          {/* TAB 0: SERVICES LIST */}
          {selectedTab === 0 && (
            <Card sx={{ borderRadius: '24px', border: '1px solid #F3F4F6', boxShadow: 'none' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                  placeholder="Search services..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} color="#9CA3AF" /></InputAdornment> } }}
                />

                <Select
                  size="small"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ width: 200, borderRadius: '12px' }}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { borderBottom: '1px solid #F3F4F6', py: 2, fontWeight: 700, color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase' } }}>
                      <TableCell>Service</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Eligible Staff</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoadingServices || isLoadingCategories ? (
                      <TableRowSkeleton columns={7} rows={5} hasAvatar={true} />
                    ) : filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">No services found.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredServices.map((service) => (
                      <TableRow key={service.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Scissors size={20} color="#7C3AED" />
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
                                  {service.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                  Tax: {service.tax || 0}% • Comm: {service.commissionRule || 'None'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={service.category?.name || 'Unknown'} size="small" sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Clock size={16} color="#6B7280" />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{service.durationMinutes} mins</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>₹{service.price}</Typography>
                          </TableCell>
                          <TableCell>
                            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.75rem' } }}>
                              {(service.staff || []).map((st) => {
                                const matchedStaff = staffList.find(s => s.id === st.staffId);
                                return matchedStaff ? <Avatar key={st.staffId} name={matchedStaff.name} /> : null;
                              })}
                            </AvatarGroup>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={service.status === 'ACTIVE' ? 'Active' : 'Archived'}
                              size="small"
                              sx={{
                                backgroundColor: service.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.12)' : '#F3F4F6',
                                color: service.status === 'ACTIVE' ? '#10B981' : '#6B7280',
                                fontWeight: 700
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleOpenEditService(service)} sx={{ color: '#7C3AED' }}><Edit2 size={18} /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteService(service.id)} sx={{ color: '#EF4444' }}><Trash2 size={18} /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
          )}

          {/* TAB 1: CATEGORIES */}
          {selectedTab === 1 && (
            <Card sx={{ borderRadius: '24px', border: '1px solid #F3F4F6', boxShadow: 'none' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Service Categories</Typography>
                <Button variant="contained" onClick={() => handleOpenCategory()} startIcon={<Plus size={18} />} sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#7C3AED' }}>
                  Add Category
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Category Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total Services</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat) => {
                      const count = services.filter(s => s.categoryId === cat.id).length;
                      return (
                        <TableRow key={cat.id}>
                          <TableCell sx={{ fontWeight: 600 }}>{cat.name}</TableCell>
                          <TableCell>{count} services</TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleOpenCategory(cat)}><Edit2 size={18} color="#7C3AED" /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={18} color="#EF4444" /></IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </Box>

        {/* --------------------------------------------------------------------- */}
        {/* CREATE / EDIT SERVICE MODAL */}
        {/* --------------------------------------------------------------------- */}
        <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '20px', p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingServiceId ? 'Edit Service' : 'Create New Service'}
            <IconButton onClick={() => setOpenAddModal(false)}><X size={20} /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ border: 'none' }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Service Name</Typography>
                <TextField fullWidth size="small" placeholder="e.g. Premium Haircut" value={formName} onChange={(e) => setFormName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Category</Typography>
                <Select fullWidth size="small" value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)}>
                  {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Duration (mins)</Typography>
                <TextField fullWidth size="small" type="number" value={formDuration} onChange={(e) => setFormDuration(Number(e.target.value))} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Price (₹)</Typography>
                <TextField fullWidth size="small" type="number" value={formPrice} onChange={(e) => setFormPrice(Number(e.target.value))} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Tax (%)</Typography>
                <TextField fullWidth size="small" type="number" value={formTax} onChange={(e) => setFormTax(Number(e.target.value))} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Status</Typography>
                <Select fullWidth size="small" value={formStatus} onChange={(e) => setFormStatus(e.target.value as 'ACTIVE'|'ARCHIVED')}>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="ARCHIVED">Archived</MenuItem>
                </Select>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Commission Rule</Typography>
                <TextField fullWidth size="small" placeholder="e.g. 20%" value={formCommission} onChange={(e) => setFormCommission(e.target.value)} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Eligible Staff</Typography>
                <Select
                  fullWidth
                  size="small"
                  multiple
                  value={formStaffIds}
                  onChange={(e) => setFormStaffIds(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const s = staffList.find(st => st.id === value);
                        return <Chip key={value} label={s?.name || value} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {staffList.map(s => (
                    <MenuItem key={s.id} value={s.id}>
                      <Checkbox checked={formStaffIds.indexOf(s.id) > -1} />
                      {s.name}
                    </MenuItem>
                  ))}
                  {staffList.length === 0 && (
                    <MenuItem disabled>No staff available</MenuItem>
                  )}
                </Select>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenAddModal(false)} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
            <Button
              onClick={handleSaveService}
              variant="contained"
              disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              sx={{ backgroundColor: '#7C3AED', fontWeight: 700, px: 4, borderRadius: '10px' }}
            >
              {editingServiceId ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* --------------------------------------------------------------------- */}
        {/* CREATE / EDIT CATEGORY MODAL */}
        {/* --------------------------------------------------------------------- */}
        <Dialog open={openCategoryModal} onClose={() => setOpenCategoryModal(false)} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '20px', p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>{editingCategoryId ? 'Edit Category' : 'Create Category'}</DialogTitle>
          <DialogContent dividers sx={{ border: 'none' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>Category Name</Typography>
            <TextField fullWidth size="small" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenCategoryModal(false)} sx={{ color: '#6B7280', fontWeight: 600 }}>Cancel</Button>
            <Button
              onClick={handleSaveCategory}
              variant="contained"
              sx={{ backgroundColor: '#7C3AED', fontWeight: 700, px: 4, borderRadius: '10px' }}
            >
              Save Category
            </Button>
          </DialogActions>
        </Dialog>

      </DashboardLayout>
    </AuthGuard>
  );
}
