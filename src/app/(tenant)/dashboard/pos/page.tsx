'use client';

import React, { useState, useMemo } from 'react';
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
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
  Search,
  Grid as GridIcon,
  List as ListIcon,
  Plus,
  X,
  Trash2,
  User,
  CreditCard,
  Banknote,
  QrCode,
  RotateCw,
  Scissors,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  MoreVertical,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { AuthGuard } from '@/shared/components/auth/AuthGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/ui/Avatar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogApiService } from '@/services/api/catalog.service';
import { inventoryApiService } from '@/services/api/inventory.service';
import { customerApiService } from '@/services/api/customer.service';
import { billingApiService, InvoiceItem } from '@/services/api/billing.service';
import { InvoiceModal } from '@/shared/components/modals/InvoiceModal';
import { PaymentModal } from '@/shared/components/modals/PaymentModal';
import { ReceiptModal } from '@/shared/components/modals/ReceiptModal';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

export interface DisplayItem {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number;
  image: string;
  type: 'service' | 'product';
}

interface CartItem {
  item: DisplayItem;
  staffName: string;
  staffAvatar: string;
  quantity: number;
}

// Removed INITIAL_SERVICES and CATEGORIES as they will be fetched dynamically.

const RECENT_ORDERS = [
  {
    id: '1',
    customer: 'John Doe',
    inv: '#INV-0012',
    amount: '₹650.00',
    method: 'Cash',
    time: '10:30 AM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    badgeColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
  },
  {
    id: '2',
    customer: 'Emma Watson',
    inv: '#INV-0011',
    amount: '₹1,200.00',
    method: 'Card',
    time: '10:15 AM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    badgeColor: '#3B82F6',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    id: '3',
    customer: 'David Smith',
    inv: '#INV-0010',
    amount: '₹800.00',
    method: 'UPI',
    time: '09:45 AM',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    badgeColor: '#7C3AED',
    badgeBg: 'rgba(124, 58, 237, 0.12)',
  },
  {
    id: '4',
    customer: 'Olivia Brown',
    inv: '#INV-0009',
    amount: '₹450.00',
    method: 'Cash',
    time: '09:30 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badgeColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
  },
];

export default function POSPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'other'>('cash');
  const [discount, setDiscount] = useState<number>(10.0);

  // Invoice -> Payment -> Receipt Flow State
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceItem | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Customer Selection State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Fetch Services & Products & Customers
  const { data: customersRaw = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerApiService.getCustomers(),
  });

  const customers = Array.isArray(customersRaw) ? customersRaw : (customersRaw as any)?.data || [];

  const { data: catalogData = [] } = useQuery({
    queryKey: QUERY_KEYS.services.all,
    queryFn: () => catalogApiService.getServices(),
  });

  const { data: inventoryData = [] } = useQuery({
    queryKey: QUERY_KEYS.inventory.all,
    queryFn: () => inventoryApiService.getInventory(),
  });

  // Map to unified DisplayItem format
  const dynamicServices: DisplayItem[] = useMemo(() => {
    return catalogData.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category?.name || 'Service',
      subtitle: item.durationMinutes ? `${item.durationMinutes} min` : 'Service',
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      image: item.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80', // fallback image
      type: 'service',
    }));
  }, [catalogData]);

  const dynamicProducts: DisplayItem[] = useMemo(() => {
    return inventoryData.map((prod) => ({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      subtitle: `${prod.stock} in stock`,
      price: typeof prod.price === 'string' ? parseFloat(prod.price.replace(/[^0-9.]/g, '')) : (prod.price || 0),
      image: prod.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80', // fallback image
      type: 'product',
    }));
  }, [inventoryData]);

  const activeItemsList = activeTab === 'services' ? dynamicServices : dynamicProducts;

  // Extract Dynamic Categories based on active items
  const dynamicCategories = useMemo(() => {
    const counts = activeItemsList.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cats = Object.entries(counts).map(([name, count]) => ({
      id: name,
      name,
      count,
      icon: Sparkles, // Use default icon
    }));

    return [{ id: 'all', name: `All ${activeTab === 'services' ? 'Services' : 'Products'}`, count: activeItemsList.length, icon: Sparkles }, ...cats];
  }, [activeItemsList, activeTab]);

  // Reset category when tab changes
  React.useEffect(() => {
    setSelectedCategory('all');
  }, [activeTab]);

  // Cart State (Starts Empty)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter Services & Products
  const filteredItems = useMemo(() => {
    return activeItemsList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, activeItemsList]);

  // Add Item to Cart
  const handleAddToCart = (item: DisplayItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [
        ...prev,
        {
          item,
          staffName: item.type === 'service' ? 'Alex Johnson' : 'Counter Sale',
          staffAvatar: item.type === 'service' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          quantity: 1,
        },
      ];
    });
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Calculate Totals
  const subtotal = useMemo(() => {
    return cart.reduce((acc, c) => acc + (c.item.price || 0) * c.quantity, 0);
  }, [cart]);

  const tax = useMemo(() => {
    return Math.round((subtotal - discount) * 0.18 * 100) / 100;
  }, [subtotal, discount]);

  const total = useMemo(() => {
    const calculated = subtotal - discount + (subtotal > 0 ? tax : 0);
    return calculated > 0 ? calculated.toFixed(2) : '0.00';
  }, [subtotal, discount, tax]);

  // Step 1: Generate Invoice
  const handleGenerateInvoice = async () => {
    if (cart.length === 0) return;

    const firstCust = customers[0];
    const additionalItems = cart.map((c) => ({
      description: `${c.item.type === 'service' ? 'Service' : 'Product'}: ${c.item.name} (Qty ${c.quantity})`,
      amount: (c.item.price || 0) * c.quantity,
    }));

    try {
      const payload: any = { additionalItems };
      const targetCustId = selectedCustomerId || (customers.length > 0 ? customers[0].id : undefined);
      if (targetCustId) {
        payload.customerId = targetCustId;
      }
      const createdInv = await billingApiService.createInvoice(payload);

      showToast.success(
        'Invoice Generated',
        `Invoice #INV-${createdInv.id.substring(0, 8).toUpperCase()} created.`
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.invoices() });
      setCurrentInvoice(createdInv);
      setIsInvoiceModalOpen(true);
    } catch (err: any) {
      const rawMsg = err?.response?.data?.message || err?.message || 'Failed to create invoice';
      const formattedMsg = Array.isArray(rawMsg) ? rawMsg.join(', ') : rawMsg;
      showToast.error('Invoice Creation Failed', formattedMsg);
    }
  };

  // Step 2: Proceed to Payment
  const handleProceedToPayment = (inv: InvoiceItem) => {
    setCurrentInvoice(inv);
    setIsInvoiceModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Step 3: Payment Success -> Receipt
  const handlePaymentSuccess = (updatedInv: InvoiceItem) => {
    setCurrentInvoice(updatedInv);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  // Close Receipt -> Clear Cart
  const handleCloseReceipt = () => {
    setIsReceiptModalOpen(false);
    setCart([]);
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box sx={{ width: '100%', maxWidth: '100%', pb: 4 }}>
          {/* Header Title Section */}
          <PageHeader
            title="POS"
            subtitle="Create invoices, process payments and manage sales."
          />

          {/* Main 2-Column POS Layout */}
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* LEFT COLUMN: Services Catalog & Recent Orders (70%) */}
            <Grid size={{ xs: 12, lg: 8, xl: 8.2 }}>
              {/* Top Control Bar: Services vs Products Toggle, Search & View Modes */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 3,
                }}
              >
                {/* Mode Selector Tabs */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#FAFAFC'),
                    p: 0.6,
                    borderRadius: '14px',
                    border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
                    width: 'fit-content',
                  }}
                >
                  <Button
                    onClick={() => setActiveTab('services')}
                    startIcon={<Scissors size={16} />}
                    sx={{
                      borderRadius: '10px',
                      px: 2.5,
                      py: 0.8,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      backgroundColor: (theme) =>
                        activeTab === 'services'
                          ? theme.palette.mode === 'dark'
                            ? '#7C3AED'
                            : '#FFFFFF'
                          : 'transparent',
                      color: (theme) =>
                        activeTab === 'services'
                          ? theme.palette.mode === 'dark'
                            ? '#FFFFFF'
                            : '#7C3AED'
                          : 'text.secondary',
                      boxShadow: activeTab === 'services' ? '0px 2px 8px rgba(0,0,0,0.12)' : 'none',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          activeTab === 'services'
                            ? theme.palette.mode === 'dark'
                              ? '#6D28D9'
                              : '#FFFFFF'
                            : 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    Services
                  </Button>
                  <Button
                    onClick={() => setActiveTab('products')}
                    startIcon={<ShoppingBag size={16} />}
                    sx={{
                      borderRadius: '10px',
                      px: 2.5,
                      py: 0.8,
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      backgroundColor: (theme) =>
                        activeTab === 'products'
                          ? theme.palette.mode === 'dark'
                            ? '#7C3AED'
                            : '#FFFFFF'
                          : 'transparent',
                      color: (theme) =>
                        activeTab === 'products'
                          ? theme.palette.mode === 'dark'
                            ? '#FFFFFF'
                            : '#7C3AED'
                          : 'text.secondary',
                      boxShadow: activeTab === 'products' ? '0px 2px 8px rgba(0,0,0,0.12)' : 'none',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          activeTab === 'products'
                            ? theme.palette.mode === 'dark'
                              ? '#6D28D9'
                              : '#FFFFFF'
                            : 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    Products
                  </Button>
                </Box>

                {/* Right Side: Search Box & View Mode Icons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: { xs: 1, sm: 0 } }}>
                  <TextField
                    placeholder="Search services..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      width: { xs: '100%', sm: 300 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF'),
                        fontSize: '0.875rem',
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={18} color="#9CA3AF" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(124, 58, 237, 0.15)',
                        color: '#A78BFA',
                        borderRadius: '10px',
                        p: 1,
                      }}
                    >
                      <Scissors size={18} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Main POS Product Grid Layout */}
              <Grid container spacing={3} sx={{ mb: 3.5 }}>
                {/* Category Vertical Sidebar (Left 25%) */}
                <Grid size={{ xs: 12, md: 3.2, lg: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: '20px',
                      border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                      p: 1.5,
                      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      {dynamicCategories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <Box
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              px: 2,
                              py: 1.2,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              backgroundColor: (theme) =>
                                isSelected
                                  ? theme.palette.mode === 'dark'
                                    ? 'rgba(124, 58, 237, 0.2)'
                                    : '#F3E8FF'
                                  : 'transparent',
                              color: isSelected ? '#A78BFA' : 'text.secondary',
                              transition: 'all 0.15s ease',
                              '&:hover': {
                                backgroundColor: (theme) =>
                                  isSelected
                                    ? theme.palette.mode === 'dark'
                                      ? 'rgba(124, 58, 237, 0.25)'
                                      : '#F3E8FF'
                                    : theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.04)'
                                    : '#FAFAFC',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <cat.icon size={16} color={isSelected ? '#A78BFA' : '#9CA3AF'} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isSelected ? 700 : 600,
                                  fontSize: '0.84rem',
                                  color: isSelected ? 'primary.main' : 'text.primary',
                                }}
                              >
                                {cat.name}
                              </Typography>
                            </Box>

                            <Chip
                              label={cat.count}
                              size="small"
                              sx={{
                                height: 20,
                                minWidth: 24,
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : isSelected ? '#FFFFFF' : '#F3F4F6'),
                                color: 'text.secondary',
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Card>
                </Grid>

                {/* Services Cards Grid (Right 75%) */}
                <Grid size={{ xs: 12, md: 8.8, lg: 9 }}>
                  <Grid container spacing={2}>
                    {filteredItems.map((service) => (
                      <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                          elevation={0}
                          onClick={() => handleAddToCart(service)}
                          sx={{
                            borderRadius: '16px',
                            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                            overflow: 'hidden',
                            cursor: 'pointer',
                            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: (theme) => (theme.palette.mode === 'dark' ? '0px 10px 25px rgba(0,0,0,0.5)' : '0px 10px 25px rgba(0,0,0,0.06)'),
                              borderColor: 'rgba(124, 58, 237, 0.5)',
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={service.image}
                            alt={service.name}
                            sx={{
                              width: '100%',
                              height: 110,
                              objectFit: 'cover',
                            }}
                          />
                          <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                            <Typography
                              variant="subtitle2"
                              noWrap
                              sx={{ fontWeight: 800, fontSize: '0.875rem', color: 'text.primary' }}
                            >
                              {service.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', fontSize: '0.72rem', mt: 0.3 }}
                            >
                              {service.subtitle}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'text.primary', mt: 0.8 }}
                            >
                              ₹{service.price}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

              {/* Bottom Section: Recent Orders Carousel */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                  p: 2.5,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
                    Recent Orders
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.8125rem', textTransform: 'none', fontWeight: 700 }}
                  >
                    View All
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {RECENT_ORDERS.map((order) => (
                    <Grid key={order.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box
                        sx={{
                          p: 1.8,
                          borderRadius: '14px',
                          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FAFAFC'),
                          border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar name={order.customer} src={order.avatar} sx={{ width: 34, height: 34 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: 'text.primary' }}>
                              {order.customer}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                              {order.inv} • {order.time}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem', color: 'text.primary' }}>
                            {order.amount}
                          </Typography>
                          <Chip
                            label={order.method}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.625rem',
                              fontWeight: 800,
                              backgroundColor: order.badgeBg,
                              color: order.badgeColor,
                              borderRadius: '4px',
                              mt: 0.3,
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            {/* RIGHT COLUMN: POS Cart & Checkout Panel (30%) */}
            <Grid size={{ xs: 12, lg: 4, xl: 3.8 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
                  p: 3,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                  position: 'sticky',
                  top: 90,
                }}
              >
                {/* Current Customer Card Header */}
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
                  Current Customer
                </Typography>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: '14px',
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FAFAFC'),
                    border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Select
                    fullWidth
                    size="small"
                    displayEmpty
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    sx={{
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        py: 0.8,
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'text.primary',
                      },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                  >
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <User size={18} color="#3B82F6" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Walk-in Customer (Default)
                        </Typography>
                      </Box>
                    </MenuItem>
                    {customers.map((c: any) => (
                      <MenuItem key={c.id} value={c.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <User size={18} color="#7C3AED" />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: 'text.primary' }}>
                              {c.name}
                            </Typography>
                            {c.phone && (
                              <Typography variant="caption" color="text.secondary">
                                {c.phone}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* Cart Section Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary' }}>
                    Cart ({cart.length})
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cart.length > 0 && (
                      <Button
                        size="small"
                        onClick={handleClearCart}
                        sx={{
                          color: '#EF4444',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                    <IconButton size="small">
                      <MoreVertical size={18} color="#9CA3AF" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Cart Items List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 3, maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
                  {cart.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <ShoppingBag size={40} style={{ opacity: 0.4, marginBottom: 8 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Your cart is empty</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Click any service to add to cart</Typography>
                    </Box>
                  ) : (
                    cart.map((item) => (
                      <Box
                        key={item.item.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            component="img"
                            src={item.item.image}
                            alt={item.item.name}
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: '10px',
                              objectFit: 'cover',
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: 'text.primary' }}>
                              {item.item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              {item.staffName}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', color: 'text.primary' }}>
                            ₹{((item.item.price || 0) * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFromCart(item.item.id)}
                            sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}
                          >
                            <X size={16} />
                          </IconButton>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>

                {/* Add Discount Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  sx={{
                    borderRadius: '12px',
                    borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.4)' : '#E5E7EB'),
                    color: (theme) => (theme.palette.mode === 'dark' ? '#A78BFA' : '#7C3AED'),
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    py: 1,
                    mb: 3,
                    borderStyle: 'dashed',
                  }}
                >
                  Add Discount
                </Button>

                {/* Totals Breakdown */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      ₹{subtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Discount
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                      -₹{discount.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Tax (18%)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      ₹{tax.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1, borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'divider') }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>
                      Total
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      ₹{total}
                    </Typography>
                  </Box>
                </Box>

                {/* Payment Method 2x2 Grid */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  {/* Cash */}
                  <Grid size={6}>
                    <Button
                      fullWidth
                      onClick={() => setPaymentMethod('cash')}
                      startIcon={<Banknote size={16} />}
                      sx={{
                        borderRadius: '12px',
                        py: 1.2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        backgroundColor: (theme) =>
                          paymentMethod === 'cash'
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(124, 58, 237, 0.2)'
                              : '#F3E8FF'
                            : theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.04)'
                            : '#FAFAFC',
                        color: (theme) =>
                          paymentMethod === 'cash'
                            ? theme.palette.mode === 'dark'
                              ? '#C4B5FD'
                              : '#7C3AED'
                            : 'text.secondary',
                        border: (theme) =>
                          paymentMethod === 'cash'
                            ? '1.5px solid #7C3AED'
                            : theme.palette.mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid #F3F4F6',
                        justifyContent: 'flex-start',
                        px: 2,
                      }}
                    >
                      Cash
                    </Button>
                  </Grid>

                  {/* Card */}
                  <Grid size={6}>
                    <Button
                      fullWidth
                      onClick={() => setPaymentMethod('card')}
                      startIcon={<CreditCard size={16} />}
                      sx={{
                        borderRadius: '12px',
                        py: 1.2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        backgroundColor: (theme) =>
                          paymentMethod === 'card'
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(124, 58, 237, 0.2)'
                              : '#F3E8FF'
                            : theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.04)'
                            : '#FAFAFC',
                        color: (theme) =>
                          paymentMethod === 'card'
                            ? theme.palette.mode === 'dark'
                              ? '#C4B5FD'
                              : '#7C3AED'
                            : 'text.secondary',
                        border: (theme) =>
                          paymentMethod === 'card'
                            ? '1.5px solid #7C3AED'
                            : theme.palette.mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid #F3F4F6',
                        justifyContent: 'flex-start',
                        px: 2,
                      }}
                    >
                      Card
                    </Button>
                  </Grid>

                  {/* UPI */}
                  <Grid size={6}>
                    <Button
                      fullWidth
                      onClick={() => setPaymentMethod('upi')}
                      startIcon={<QrCode size={16} />}
                      sx={{
                        borderRadius: '12px',
                        py: 1.2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        backgroundColor: (theme) =>
                          paymentMethod === 'upi'
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(124, 58, 237, 0.2)'
                              : '#F3E8FF'
                            : theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.04)'
                            : '#FAFAFC',
                        color: (theme) =>
                          paymentMethod === 'upi'
                            ? theme.palette.mode === 'dark'
                              ? '#C4B5FD'
                              : '#7C3AED'
                            : 'text.secondary',
                        border: (theme) =>
                          paymentMethod === 'upi'
                            ? '1.5px solid #7C3AED'
                            : theme.palette.mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid #F3F4F6',
                        justifyContent: 'flex-start',
                        px: 2,
                      }}
                    >
                      UPI
                    </Button>
                  </Grid>

                  {/* Other */}
                  <Grid size={6}>
                    <Button
                      fullWidth
                      onClick={() => setPaymentMethod('other')}
                      startIcon={<RotateCw size={16} />}
                      sx={{
                        borderRadius: '12px',
                        py: 1.2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        backgroundColor: (theme) =>
                          paymentMethod === 'other'
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(124, 58, 237, 0.2)'
                              : '#F3E8FF'
                            : theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.04)'
                            : '#FAFAFC',
                        color: (theme) =>
                          paymentMethod === 'other'
                            ? theme.palette.mode === 'dark'
                              ? '#C4B5FD'
                              : '#7C3AED'
                            : 'text.secondary',
                        border: (theme) =>
                          paymentMethod === 'other'
                            ? '1.5px solid #7C3AED'
                            : theme.palette.mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid #F3F4F6',
                        justifyContent: 'flex-start',
                        px: 2,
                      }}
                    >
                      Other
                    </Button>
                  </Grid>
                </Grid>

                {/* Primary Checkout / Generate Invoice Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleGenerateInvoice}
                  disabled={cart.length === 0}
                  sx={{
                    height: 52,
                    borderRadius: '14px',
                    backgroundColor: '#7C3AED',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    boxShadow: '0px 8px 20px rgba(124, 58, 237, 0.3)',
                    '&:hover': {
                      backgroundColor: '#6D28D9',
                    },
                  }}
                >
                  Generate Invoice & Checkout (₹{total})
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Step 1: Invoice Modal */}
        <InvoiceModal
          open={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoice={currentInvoice}
          onProceedToPayment={handleProceedToPayment}
        />

        {/* Step 2: Payment Modal */}
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          invoice={currentInvoice}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Step 3: Receipt Modal */}
        <ReceiptModal
          open={isReceiptModalOpen}
          onClose={handleCloseReceipt}
          invoice={currentInvoice}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
