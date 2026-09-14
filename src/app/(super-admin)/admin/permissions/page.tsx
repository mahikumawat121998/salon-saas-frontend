'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Tabs from '@mui/material/Tabs';

import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  Key,
  Layers,
  Plus,
  Search,
  RefreshCw,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Lock,
  Zap,
} from 'lucide-react';
import { adminApiService } from '@/services/api/admin.service';
import { showToast } from '@/shared/components/Toast';

interface FeatureItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  permissions?: Array<{ id: string; code: string; name: string }>;
  plans?: Array<{ plan: { name: string; code: string } }>;
}

interface PermissionCatalogItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  featureId?: string;
  feature?: { id: string; code: string; name: string };
}

export default function SuperAdminPermissionsPage() {
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionCatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create/Edit Feature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [featureCode, setFeatureCode] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureCategory, setFeatureCategory] = useState('Core Operations');
  const [featureDesc, setFeatureDesc] = useState('');

  // Create/Edit Permission Modal State
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionCatalogItem | null>(null);
  const [permCode, setPermCode] = useState('');
  const [permName, setPermName] = useState('');
  const [permFeatureId, setPermFeatureId] = useState('');
  const [permDesc, setPermDesc] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [featList, permList] = await Promise.all([
        adminApiService.getFeatures(),
        adminApiService.getPermissionsCatalog(),
      ]);
      setFeatures(featList);
      setPermissions(permList);
    } catch (err: any) {
      showToast.error('Failed to load permission catalog', err.message || 'Error fetching features catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Feature Handlers
  const handleOpenCreateFeature = () => {
    setEditingFeature(null);
    setFeatureCode('');
    setFeatureName('');
    setFeatureCategory('Core Operations');
    setFeatureDesc('');
    setIsFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (feat: FeatureItem) => {
    setEditingFeature(feat);
    setFeatureCode(feat.code);
    setFeatureName(feat.name);
    setFeatureCategory(feat.category || 'Core Operations');
    setFeatureDesc(feat.description || '');
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeature = async () => {
    if (!featureCode.trim() || !featureName.trim()) {
      showToast.error('Validation Error', 'Feature code and name are required');
      return;
    }

    try {
      if (editingFeature) {
        await adminApiService.updateFeature(editingFeature.id, {
          name: featureName,
          category: featureCategory,
          description: featureDesc,
        });
        showToast.success('Feature Updated', `Successfully updated feature ${featureName}`);
      } else {
        await adminApiService.createFeature({
          code: featureCode.toUpperCase().replace(/\s+/g, '_'),
          name: featureName,
          category: featureCategory,
          description: featureDesc,
        });
        showToast.success('Feature Created', `Successfully created feature ${featureName}`);
      }
      setIsFeatureModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast.error('Save Failed', err.message || 'Error saving feature');
    }
  };

  // Permission Handlers
  const handleOpenCreatePermission = () => {
    setEditingPermission(null);
    setPermCode('');
    setPermName('');
    setPermFeatureId(features[0]?.id || '');
    setPermDesc('');
    setIsPermissionModalOpen(true);
  };

  const handleOpenEditPermission = (perm: PermissionCatalogItem) => {
    setEditingPermission(perm);
    setPermCode(perm.code);
    setPermName(perm.name);
    setPermFeatureId(perm.featureId || features[0]?.id || '');
    setPermDesc(perm.description || '');
    setIsPermissionModalOpen(true);
  };

  const handleSavePermission = async () => {
    if (!permCode.trim() || !permName.trim() || !permFeatureId) {
      showToast.error('Validation Error', 'Permission code, name, and target feature are required');
      return;
    }

    try {
      if (editingPermission) {
        await adminApiService.updatePermissionCatalog(editingPermission.id, {
          name: permName,
          featureId: permFeatureId,
          description: permDesc,
        });
        showToast.success('Permission Updated', `Updated permission ${permName}`);
      } else {
        await adminApiService.createPermissionCatalog({
          code: permCode.toLowerCase().replace(/\s+/g, '.'),
          name: permName,
          featureId: permFeatureId,
          description: permDesc,
        });
        showToast.success('Permission Created', `Created permission ${permName}`);
      }
      setIsPermissionModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast.error('Save Failed', err.message || 'Error saving permission');
    }
  };

  const handleDeletePermission = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete permission '${name}'?`)) return;
    try {
      await adminApiService.deletePermissionCatalog(id);
      showToast.success('Permission Deleted', `Deleted permission ${name}`);
      fetchData();
    } catch (err: any) {
      showToast.error('Delete Failed', err.message || 'Could not delete permission');
    }
  };

  const filteredPermissions = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.feature?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
              }}
            >
              <Key size={22} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Feature & Permission Catalog
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Super Admin catalog for system feature modules, granular authorization keys, and subscription feature gates
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={handleOpenCreateFeature}
            startIcon={<Plus size={16} />}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2,
              py: 1,
              borderColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#E2E8F0'),
            }}
          >
            Create Feature
          </Button>

          <Button
            variant="contained"
            onClick={handleOpenCreatePermission}
            startIcon={<Plus size={16} />}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 800,
              px: 2.5,
              py: 1,
              backgroundColor: '#7C3AED',
              '&:hover': { backgroundColor: '#6D28D9' },
            }}
          >
            Create Permission
          </Button>
        </Box>
      </Box>

      {/* KPI Cards Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                System Feature Modules
              </Typography>
              <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED' }}>
                <Layers size={18} />
              </Box>
            </Box>
            {loading ? (
              <Skeleton variant="text" width="60%" height={44} animation="wave" />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
                {features.length} Features
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Available across subscription tiers
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                Granular Permission Keys
              </Typography>
              <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <Key size={18} />
              </Box>
            </Box>
            {loading ? (
              <Skeleton variant="text" width="60%" height={44} animation="wave" />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
                {permissions.length} Keys
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Defined for RBAC role mapping
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                Double-Gate Authorization
              </Typography>
              <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <Shield size={18} />
              </Box>
            </Box>
            {loading ? (
              <Skeleton variant="text" width="50%" height={32} animation="wave" />
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#10B981', mt: 0.5 }}>
                Active & Enforced
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Plan Gate + User Role Gate Enforced
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.9375rem' } }}>
          <Tab icon={<Layers size={18} />} iconPosition="start" label="Feature Catalog (System Modules)" />
          <Tab icon={<Key size={18} />} iconPosition="start" label={`Permissions Catalog (${permissions.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Features Grid */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Grid key={idx} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                      border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Skeleton variant="text" width="55%" height={30} animation="wave" />
                      <Skeleton variant="rounded" width="30%" height={24} sx={{ borderRadius: '8px' }} animation="wave" />
                    </Box>
                    <Skeleton variant="text" width="90%" animation="wave" />
                    <Skeleton variant="text" width="70%" animation="wave" sx={{ mb: 2.5 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '12px', mb: 2 }} animation="wave" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5 }}>
                      <Skeleton variant="rounded" width="35%" height={22} sx={{ borderRadius: '8px' }} animation="wave" />
                      <Skeleton variant="text" width="25%" height={22} animation="wave" />
                    </Box>
                  </Card>
                </Grid>
              ))
            : features.map((feat) => (
                <Grid key={feat.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
                      border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                        {feat.name}
                      </Typography>
                      <Chip label={feat.code} size="small" sx={{ fontWeight: 800, backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA' }} />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, flexGrow: 1 }}>
                      {feat.description || 'System feature module'}
                    </Typography>

                    <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC'), mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                        ATTACHED PERMISSIONS ({feat.permissions?.length || 0})
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(feat.permissions || []).slice(0, 4).map((p) => (
                          <Chip key={p.id} label={p.code} size="small" variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
                        ))}
                        {(feat.permissions?.length || 0) > 4 && (
                          <Chip label={`+${(feat.permissions?.length || 0) - 4} more`} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9') }}>
                      <Chip label={feat.category} size="small" variant="outlined" sx={{ fontSize: '0.68rem', fontWeight: 700 }} />
                      <Button size="small" onClick={() => handleOpenEditFeature(feat)} startIcon={<Edit2 size={14} />} sx={{ textTransform: 'none', fontWeight: 700, color: '#7C3AED' }}>
                        Edit Feature
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
        </Grid>
      )}

      {/* Tab 1: Permissions Matrix Table */}
      {activeTab === 1 && (
        <Card sx={{ borderRadius: '16px', backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'), border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'), overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0') }}>
            <TextField
              size="small"
              placeholder="Search by permission name, key or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={16} color="#9CA3AF" /></InputAdornment> } }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Showing {filteredPermissions.length} permissions
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC') }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Permission Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Permission Key</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Belongs to Feature</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton variant="text" width="70%" animation="wave" /></TableCell>
                        <TableCell><Skeleton variant="rounded" width="60%" height={24} sx={{ borderRadius: '6px' }} animation="wave" /></TableCell>
                        <TableCell><Skeleton variant="rounded" width="50%" height={24} sx={{ borderRadius: '6px' }} animation="wave" /></TableCell>
                        <TableCell><Skeleton variant="text" width="85%" animation="wave" /></TableCell>
                        <TableCell align="right"><Skeleton variant="circular" width={28} height={28} sx={{ display: 'inline-block' }} animation="wave" /></TableCell>
                      </TableRow>
                    ))
                  : filteredPermissions.map((perm) => (
                      <TableRow key={perm.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {perm.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={perm.code} size="small" sx={{ fontFamily: 'monospace', fontWeight: 800, backgroundColor: (t) => (t.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.2)' : '#F3E8FF'), color: (t) => (t.palette.mode === 'dark' ? '#C084FC' : '#7C3AED') }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={perm.feature?.name || perm.feature?.code || 'Core'} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                            {perm.description || 'Granular permission definition'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Permission">
                            <IconButton size="small" onClick={() => handleOpenEditPermission(perm)} sx={{ color: '#7C3AED' }}>
                              <Edit2 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Permission">
                            <IconButton size="small" onClick={() => handleDeletePermission(perm.id, perm.name)} sx={{ color: '#EF4444' }}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* CREATE / EDIT FEATURE MODAL */}

      <Dialog
        open={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              p: 1,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
          {editingFeature ? `Edit Feature: ${editingFeature.name}` : 'Create New Feature Module'}
          <IconButton onClick={() => setIsFeatureModalOpen(false)} size="small"><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: 'none', py: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Feature Code *</Typography>
            <TextField fullWidth size="small" placeholder="e.g. MARKETING" disabled={!!editingFeature} value={featureCode} onChange={(e) => setFeatureCode(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Feature Name *</Typography>
            <TextField fullWidth size="small" placeholder="e.g. Marketing Campaigns" value={featureName} onChange={(e) => setFeatureName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Category</Typography>
            <Select fullWidth size="small" value={featureCategory} onChange={(e) => setFeatureCategory(e.target.value)} sx={{ borderRadius: '10px' }}>
              <MenuItem value="Core Operations">Core Operations</MenuItem>
              <MenuItem value="Advanced Modules">Advanced Modules</MenuItem>
              <MenuItem value="Growth & Engagement">Growth & Engagement</MenuItem>
            </Select>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Description</Typography>
            <TextField fullWidth multiline rows={3} placeholder="Describe what this feature module does" value={featureDesc} onChange={(e) => setFeatureDesc(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsFeatureModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveFeature} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>
            Save Feature
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE / EDIT PERMISSION MODAL */}
      <Dialog
        open={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              p: 1,
              backgroundColor: (t) => (t.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
          {editingPermission ? `Edit Permission: ${editingPermission.name}` : 'Create New Permission Key'}
          <IconButton onClick={() => setIsPermissionModalOpen(false)} size="small"><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: 'none', py: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Permission Key *</Typography>
            <TextField fullWidth size="small" placeholder="e.g. customers.export" disabled={!!editingPermission} value={permCode} onChange={(e) => setPermCode(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Permission Name *</Typography>
            <TextField fullWidth size="small" placeholder="e.g. Export Customer Data" value={permName} onChange={(e) => setPermName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Belongs to Feature Module *</Typography>
            <Select fullWidth size="small" value={permFeatureId} onChange={(e) => setPermFeatureId(e.target.value)} sx={{ borderRadius: '10px' }}>
              {features.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.name} ({f.code})</MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: 'text.secondary' }}>Description</Typography>
            <TextField fullWidth multiline rows={2} placeholder="Description of what this authorization key allows" value={permDesc} onChange={(e) => setPermDesc(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setIsPermissionModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePermission} sx={{ backgroundColor: '#7C3AED', textTransform: 'none', fontWeight: 800, borderRadius: '10px', px: 3 }}>
            Save Permission
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
