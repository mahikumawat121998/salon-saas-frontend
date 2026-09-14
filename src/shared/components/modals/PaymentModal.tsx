'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { X, CreditCard, Banknote, QrCode, Building2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApiService, InvoiceItem } from '@/services/api/billing.service';
import { QUERY_KEYS } from '@/config/query-keys';
import { showToast } from '@/shared/components/Toast';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceItem | null;
  onPaymentSuccess: (updatedInvoice: InvoiceItem) => void;
}

export function PaymentModal({ open, onClose, invoice, onPaymentSuccess }: PaymentModalProps) {
  const queryClient = useQueryClient();

  const totalAmount = Number(invoice?.totalAmount || 0);
  const totalPaid = (invoice?.payments || [])
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const balanceOwed = Math.max(0, totalAmount - totalPaid);

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'NET_BANKING' | 'RAZORPAY' | 'OTHER'>('RAZORPAY');
  const [payAmount, setPayAmount] = useState<string>(balanceOwed.toString());

  // Update payAmount when invoice changes
  React.useEffect(() => {
    if (invoice) {
      const remaining = Math.max(0, Number(invoice.totalAmount || 0) - (invoice.payments || []).reduce((s, p) => s + Number(p.amount), 0));
      setPayAmount(remaining.toString());
    }
  }, [invoice]);

  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const recordPaymentMutation = useMutation({
    mutationFn: (dto: { amount: number; method: any; razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string }) => {
      if (!invoice) throw new Error('No invoice selected');
      return billingApiService.recordPayment(invoice.id, dto);
    },
    onSuccess: (updatedInv: InvoiceItem) => {
      showToast.success('Payment Received', `Payment of ₹${payAmount} recorded successfully.`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.billing.invoices() });
      onPaymentSuccess(updatedInv);
    },
    onError: (err: any) => {
      const rawMsg = err?.response?.data?.message || err?.message || 'Payment recording failed';
      const formattedMsg = Array.isArray(rawMsg) ? rawMsg.join(', ') : rawMsg;
      showToast.error('Payment Failed', formattedMsg);
    },
  });

  const handleRazorpayPayment = async () => {
    if (!invoice) return;
    setIsRazorpayLoading(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        showToast.error('Razorpay SDK Failed', 'Could not load Razorpay SDK. Check internet connection.');
        setIsRazorpayLoading(false);
        return;
      }

      // Step 1: Create Razorpay Order from Backend
      const amountNum = Number(payAmount);
      const orderData = await billingApiService.createRazorpayOrder(invoice.id, amountNum);

      // Step 2: Open Razorpay Checkout Popup
      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Tb9UmqkZywf37X',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SalonOS Management Suite',
        description: `Payment for Invoice #INV-${invoice.id.substring(0, 8).toUpperCase()}`,
        order_id: orderData.orderId,
        prefill: {
          name: invoice.customer?.name || 'Customer',
          email: invoice.customer?.email || 'customer@salon.com',
          contact: invoice.customer?.phone || '9876543210',
        },
        theme: {
          color: '#7C3AED',
        },
        handler: async function (response: any) {
          // Step 3: On Successful Payment, Record in Database
          recordPaymentMutation.mutate({
            amount: amountNum,
            method: 'RAZORPAY',
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: function () {
            setIsRazorpayLoading(false);
            showToast.info('Payment Cancelled', 'Razorpay checkout popup closed.');
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      const rawMsg = err?.response?.data?.message || err?.message || 'Failed to initialize Razorpay order';
      showToast.error('Razorpay Order Failed', rawMsg);
    } finally {
      setIsRazorpayLoading(false);
    }
  };

  if (!invoice) return null;

  const methods = [
    { key: 'RAZORPAY', label: 'Razorpay / Online', icon: QrCode, color: '#60A5FA', bg: 'rgba(59, 130, 246, 0.15)' },
    { key: 'CASH', label: 'Cash', icon: Banknote, color: '#34D399', bg: 'rgba(16, 185, 129, 0.15)' },
    { key: 'CARD', label: 'Card', icon: CreditCard, color: '#60A5FA', bg: 'rgba(59, 130, 246, 0.15)' },
    { key: 'UPI', label: 'UPI / QR Direct', icon: QrCode, color: '#C4B5FD', bg: 'rgba(139, 92, 246, 0.15)' },
    { key: 'NET_BANKING', label: 'Net Banking', icon: Building2, color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.15)' },
  ];

  const shortId = invoice.id.substring(0, 8).toUpperCase();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 1,
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
            backgroundImage: 'none',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: 'text.primary' }}>
        Record Payment for Invoice #{shortId}
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'), py: 2 }}>
        {/* Invoice Summary Box */}
        <Box
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB'),
            borderRadius: '14px',
            p: 2,
            mb: 3,
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Customer: {invoice.customer?.name || 'Walk-in'}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Total Invoice Amount: ₹{totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Balance Due:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#EF4444' }}>
              ₹{balanceOwed.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Payment Method Selector Grid */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
          Select Payment Method
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {methods.map((m) => {
            const Icon = m.icon;
            const isSelected = paymentMethod === m.key;
            return (
              <Grid size={6} key={m.key}>
                <Card
                  onClick={() => setPaymentMethod(m.key as any)}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: (theme) => `2px solid ${isSelected ? m.color : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F3F4F6'}`,
                    backgroundColor: (theme) => (isSelected ? m.bg : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF'),
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '10px',
                      backgroundColor: m.bg,
                      color: m.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: isSelected ? 800 : 700, color: 'text.primary' }}>
                    {m.label}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Payment Amount Field */}
        <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'text.secondary' }}>
          Payment Amount (₹) *
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF'),
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2.5, backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#F9FAFB'), borderTop: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6') }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={recordPaymentMutation.isPending || isRazorpayLoading || !payAmount || Number(payAmount) <= 0}
          onClick={() => {
            if (paymentMethod === 'RAZORPAY') {
              handleRazorpayPayment();
            } else {
              recordPaymentMutation.mutate({
                amount: Number(payAmount),
                method: paymentMethod,
              });
            }
          }}
          startIcon={<CheckCircle2 size={16} />}
          sx={{
            backgroundColor: paymentMethod === 'RAZORPAY' ? '#7C3AED' : '#10B981',
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: '10px',
            px: 3,
            '&:hover': { backgroundColor: paymentMethod === 'RAZORPAY' ? '#6D28D9' : '#059669' },
          }}
        >
          {recordPaymentMutation.isPending || isRazorpayLoading
            ? 'Opening Gateway...'
            : paymentMethod === 'RAZORPAY'
            ? `Pay ₹${payAmount} via Razorpay`
            : `Confirm Payment of ₹${payAmount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentModal;
