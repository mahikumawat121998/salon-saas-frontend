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
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { InvoiceItem } from '@/services/api/billing.service';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceItem | null;
}

export function ReceiptModal({ open, onClose, invoice }: ReceiptModalProps) {
  if (!invoice) return null;

  const totalAmount = Number(invoice.totalAmount || 0);
  const totalPaid = (invoice.payments || [])
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const balanceOwed = Math.max(0, totalAmount - totalPaid);

  const shortId = invoice.id.substring(0, 8).toUpperCase();
  const latestPayment = invoice.payments && invoice.payments.length > 0
    ? invoice.payments[invoice.payments.length - 1]
    : null;

  const dateStr = new Date().toLocaleDateString('en-IN', {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle2 size={22} color="#10B981" />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Payment Receipt
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" className="no-print" sx={{ color: 'text.secondary', '@media print': { display: 'none !important' } }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F3F4F6'), py: 2 }}>
        {/* Success Header Badge */}
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'),
            borderRadius: '16px',
            p: 3,
            mb: 3,
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #A7F3D0'),
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5'),
              border: '2px solid #10B981',
              color: '#10B981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              boxShadow: '0px 4px 14px rgba(16, 185, 129, 0.2)',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <CheckCircle2 size={30} color="#10B981" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: (theme) => (theme.palette.mode === 'dark' ? '#34D399' : '#065F46'), mb: 0.5 }}>
            ₹{totalPaid.toFixed(2)} Received
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: (theme) => (theme.palette.mode === 'dark' ? '#6EE7B7' : '#047857') }}>
            Receipt #RCP-{shortId} • {dateStr}
          </Typography>
        </Box>

        {/* Receipt Information Grid */}
        <Box sx={{
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB'),
          borderRadius: '14px',
          p: 2,
          mb: 3,
          border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'),
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Customer:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {invoice.customer?.name || 'Walk-in Customer'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Invoice Reference:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: (theme) => (theme.palette.mode === 'dark' ? '#C4B5FD' : '#7C3AED') }}>
              INV-{shortId}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Payment Method:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {latestPayment?.method || 'CASH'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1, borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'divider') }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Remaining Balance Due:
            </Typography>
            <Chip
              label={balanceOwed <= 0 ? 'PAID IN FULL (₹0.00)' : `₹${balanceOwed.toFixed(2)} DUE`}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.72rem',
                backgroundColor: balanceOwed <= 0
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
                color: balanceOwed <= 0 ? '#34D399' : '#FBBF24',
              }}
            />
          </Box>
        </Box>

        {/* Line Items Summary */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          Items Purchased
        </Typography>

        <Table size="small" sx={{ border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #F3F4F6'), borderRadius: '10px' }}>
          <TableHead sx={{ backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB') }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Item</TableCell>
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
          Print Receipt
        </Button>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: '#7C3AED',
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: '10px',
            px: 3,
            '&:hover': { backgroundColor: '#6D28D9' },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReceiptModal;
