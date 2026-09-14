'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { X, Printer, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { InvoiceItem } from '@/services/api/billing.service';

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceItem | null;
  onProceedToPayment?: (invoice: InvoiceItem) => void;
}

export function InvoiceModal({ open, onClose, invoice, onProceedToPayment }: InvoiceModalProps) {
  if (!invoice) return null;

  const totalAmount = Number(invoice.totalAmount || 0);
  const totalPaid = (invoice.payments || [])
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const balanceOwed = Math.max(0, totalAmount - totalPaid);
  const isPaid = invoice.status === 'PAID' || balanceOwed <= 0;

  const shortId = invoice.id.substring(0, 8).toUpperCase();
  const dateStr = new Date(invoice.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Invoice #{shortId}
          </Typography>
          <Chip
            label={isPaid ? 'PAID' : invoice.status === 'CANCELLED' ? 'CANCELLED' : 'UNPAID / PENDING'}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.72rem',
              backgroundColor: (theme) =>
                isPaid
                  ? theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'
                  : invoice.status === 'CANCELLED'
                  ? theme.palette.mode === 'dark' ? 'rgba(156, 163, 175, 0.15)' : '#F3F4F6'
                  : theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
              color: (theme) =>
                isPaid
                  ? theme.palette.mode === 'dark' ? '#34D399' : '#10B981'
                  : invoice.status === 'CANCELLED'
                  ? theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                  : theme.palette.mode === 'dark' ? '#FBBF24' : '#D97706',
            }}
          />
        </Box>
        <IconButton onClick={onClose} size="small" className="no-print" sx={{ color: 'text.secondary', '@media print': { display: 'none !important' } }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'), py: 2 }}>
        {/* Top Invoice Banner */}
        <Box
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB'),
            borderRadius: '16px',
            p: 2.5,
            mb: 3,
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED'), mb: 0.5 }}>
              Urban Cuts Salon
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Date: {dateStr}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Invoice Ref: INV-{shortId}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.3 }}>
              Billed To:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {invoice.customer?.name || 'Walk-in Customer'}
            </Typography>
            {invoice.customer?.phone && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {invoice.customer.phone}
              </Typography>
            )}
            {invoice.customer?.email && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {invoice.customer.email}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Itemized Line Items Table */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
          Line Items (What Customer Owes)
        </Typography>

        <Table size="small" sx={{ mb: 3, border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'), borderRadius: '12px', overflow: 'hidden' }}>
          <TableHead sx={{ backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB') }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(invoice.items || []).map((item, idx) => (
              <TableRow key={idx} sx={{ '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary', borderBottom: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9') }}>{item.description}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary', borderBottom: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9') }}>
                  ₹{Number(item.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Owed & Balance Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: { xs: '100%', sm: '320px' }, backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB'), p: 2, borderRadius: '14px', border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E5E7EB') }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Amount Owed:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                ₹{totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Amount Paid So Far:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981' }}>
                ₹{totalPaid.toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'divider') }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Balance Due:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: balanceOwed > 0 ? '#EF4444' : '#10B981' }}>
                ₹{balanceOwed.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        className="no-print"
        sx={{
          p: 2.5,
          justifyContent: 'space-between',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : '#F9FAFB'),
          borderTop: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'),
          '@media print': { display: 'none !important' },
        }}
      >
        <Button
          onClick={handlePrint}
          startIcon={<Printer size={16} />}
          sx={{ color: 'text.primary', fontWeight: 700, textTransform: 'none' }}
        >
          Print Invoice
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
            Close
          </Button>

          {!isPaid && onProceedToPayment && (
            <Button
              variant="contained"
              onClick={() => onProceedToPayment(invoice)}
              startIcon={<CreditCard size={16} />}
              sx={{
                backgroundColor: '#7C3AED',
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: '10px',
                px: 3,
                boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.3)',
              }}
            >
              Proceed to Payment (₹{balanceOwed.toFixed(2)}) →
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default InvoiceModal;
