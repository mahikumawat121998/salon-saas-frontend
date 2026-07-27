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
import { useQuery } from '@tanstack/react-query';
import { catalogApiService } from '@/services/api/catalog.service';
import { inventoryApiService } from '@/services/api/inventory.service';
import { QUERY_KEYS } from '@/config/query-keys';

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
    amount: '$65.00',
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
    amount: '$120.00',
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
    amount: '$80.00',
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
    amount: '$45.00',
    method: 'Cash',
    time: '09:30 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badgeColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
  },
];

export default function POSPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'other'>('cash');
  const [discount, setDiscount] = useState<number>(10.0);

  // Fetch Services & Products
  const { data: catalogData = [] } = useQuery({
    queryKey: QUERY_KEYS.services.all,
    queryFn: () => catalogApiService.getCatalog(),
  });

  const { data: inventoryData = [] } = useQuery({
    queryKey: QUERY_KEYS.inventory.all,
    queryFn: () => inventoryApiService.getInventory(),
  });

  // Map to unified DisplayItem format
  const dynamicServices: DisplayItem[] = useMemo(() => {
    return catalogData.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      subtitle: item.duration ? `${item.duration} min` : 'Service',
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
                    backgroundColor: '#FAFAFC',
                    p: 0.6,
                    borderRadius: '14px',
                    border: '1px solid #F3F4F6',
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
                      backgroundColor: activeTab === 'services' ? '#FFFFFF' : 'transparent',
                      color: activeTab === 'services' ? '#7C3AED' : '#6B7280',
                      boxShadow: activeTab === 'services' ? '0px 2px 8px rgba(0,0,0,0.06)' : 'none',
                      '&:hover': {
                        backgroundColor: activeTab === 'services' ? '#FFFFFF' : 'rgba(0,0,0,0.02)',
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
                      backgroundColor: activeTab === 'products' ? '#FFFFFF' : 'transparent',
                      color: activeTab === 'products' ? '#7C3AED' : '#6B7280',
                      boxShadow: activeTab === 'products' ? '0px 2px 8px rgba(0,0,0,0.06)' : 'none',
                      '&:hover': {
                        backgroundColor: activeTab === 'products' ? '#FFFFFF' : 'rgba(0,0,0,0.02)',
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
                        backgroundColor: '#FFFFFF',
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
                        backgroundColor: '#F3E8FF',
                        color: '#7C3AED',
                        borderRadius: '10px',
                        p: 1,
                      }}
                    >
                      <GridIcon size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        p: 1,
                        color: '#6B7280',
                      }}
                    >
                      <ListIcon size={18} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Category Sidebar + Services Grid Container */}
              <Grid container spacing={3} sx={{ mb: 3.5 }}>
                {/* Category Vertical Sidebar (Left 25%) */}
                <Grid size={{ xs: 12, md: 3.2, lg: 3 }}>
                  <Card
                    sx={{
                      borderRadius: '20px',
                      border: '1px solid #F3F4F6',
                      p: 1.5,
                      backgroundColor: '#FFFFFF',
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
                              backgroundColor: isSelected ? '#F3E8FF' : 'transparent',
                              color: isSelected ? '#7C3AED' : '#4B5563',
                              transition: 'all 0.15s ease',
                              '&:hover': {
                                backgroundColor: isSelected ? '#F3E8FF' : '#FAFAFC',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <cat.icon size={16} color={isSelected ? '#7C3AED' : '#9CA3AF'} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isSelected ? 700 : 600,
                                  fontSize: '0.84rem',
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
                                backgroundColor: isSelected ? '#FFFFFF' : '#F3F4F6',
                                color: isSelected ? '#7C3AED' : '#6B7280',
                                border: isSelected ? '1px solid rgba(124, 58, 237, 0.2)' : 'none',
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
                          onClick={() => handleAddToCart(service)}
                          sx={{
                            borderRadius: '16px',
                            border: '1px solid #F3F4F6',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            backgroundColor: '#FFFFFF',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0px 10px 25px rgba(0,0,0,0.06)',
                              borderColor: 'rgba(124, 58, 237, 0.3)',
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
                              sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}
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
                              sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827', mt: 0.8 }}
                            >
                              ${service.price.toFixed(2)}
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
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #F3F4F6',
                  p: 2.5,
                  backgroundColor: '#FFFFFF',
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
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
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
                          backgroundColor: '#FAFAFC',
                          border: '1px solid #F3F4F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <Avatar name={order.customer} src={order.avatar} sx={{ width: 36, height: 36 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                              {order.customer}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                              {order.inv}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5 }}>
                              <Chip
                                label={order.method}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  backgroundColor: order.badgeBg,
                                  color: order.badgeColor,
                                  borderRadius: '4px',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}>
                            {order.amount}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', mt: 0.5, display: 'block' }}>
                            {order.time}
                          </Typography>
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
                sx={{
                  borderRadius: '20px',
                  border: '1px solid #F3F4F6',
                  p: 3,
                  backgroundColor: '#FFFFFF',
                  position: 'sticky',
                  top: 90,
                }}
              >
                {/* Current Customer Card Header */}
                <Typography variant="subtitle2" color="#111827" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Current Customer
                </Typography>
                <Box
                  sx={{
                    p: 1.8,
                    borderRadius: '14px',
                    backgroundColor: '#FAFAFC',
                    border: '1px solid #F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        color: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <User size={18} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>
                      Walk-in Customer
                    </Typography>
                  </Box>

                  <IconButton size="small" sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <Plus size={16} color="#6B7280" />
                  </IconButton>
                </Box>

                {/* Cart Section Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
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
                    <Box sx={{ textAlign: 'center', py: 4, color: '#9CA3AF' }}>
                      <ShoppingBag size={40} style={{ opacity: 0.4, marginBottom: 8 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Your cart is empty</Typography>
                      <Typography variant="caption">Click any service to add to cart</Typography>
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
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#111827' }}>
                              {item.item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                              {item.staffName}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}>
                            ${((item.item.price || 0) * item.quantity).toFixed(2)}
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
                    borderColor: '#E5E7EB',
                    color: '#7C3AED',
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
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700 }}>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Discount
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 700 }}>
                      -${discount.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Tax (18%)
                    </Typography>
                    <Typography variant="body2" color="#111827" sx={{ fontWeight: 700 }}>
                      ${tax.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>
                      Total
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                      ${total}
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
                        backgroundColor: paymentMethod === 'cash' ? '#F3E8FF' : '#FAFAFC',
                        color: paymentMethod === 'cash' ? '#7C3AED' : '#4B5563',
                        border: paymentMethod === 'cash' ? '1.5px solid #7C3AED' : '1px solid #F3F4F6',
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
                        backgroundColor: paymentMethod === 'card' ? '#F3E8FF' : '#FAFAFC',
                        color: paymentMethod === 'card' ? '#7C3AED' : '#4B5563',
                        border: paymentMethod === 'card' ? '1.5px solid #7C3AED' : '1px solid #F3F4F6',
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
                        backgroundColor: paymentMethod === 'upi' ? '#F3E8FF' : '#FAFAFC',
                        color: paymentMethod === 'upi' ? '#7C3AED' : '#4B5563',
                        border: paymentMethod === 'upi' ? '1.5px solid #7C3AED' : '1px solid #F3F4F6',
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
                        backgroundColor: paymentMethod === 'other' ? '#F3E8FF' : '#FAFAFC',
                        color: paymentMethod === 'other' ? '#7C3AED' : '#4B5563',
                        border: paymentMethod === 'other' ? '1.5px solid #7C3AED' : '1px solid #F3F4F6',
                        justifyContent: 'flex-start',
                        px: 2,
                      }}
                    >
                      Other
                    </Button>
                  </Grid>
                </Grid>

                {/* Primary Checkout / Pay Button */}
                <Button
                  fullWidth
                  variant="contained"
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
                  Pay ${total}
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </AuthGuard>
  );
}
