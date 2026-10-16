'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { Calendar, Banknote, Users, Clock, CheckCircle2, AlertCircle, Scissors } from 'lucide-react';

interface ToolCardProps {
  name: string;
  result: any;
}

export const AiToolCard: React.FC<ToolCardProps> = ({ name, result }) => {
  if (!result) return null;

  // 1. Revenue Card
  if (name === 'getRevenueSummary') {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1.5,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(240, 253, 244, 0.9) 100%)',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.25)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Banknote size={18} color="#10b981" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10b981' }}>
            Revenue Snapshot ({result.date})
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          ₹{Number(result.totalRevenue || 0).toLocaleString()}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          {result.paymentBreakdown?.cash > 0 && (
            <Chip size="small" label={`Cash: ₹${result.paymentBreakdown.cash}`} variant="outlined" />
          )}
          {result.paymentBreakdown?.upi > 0 && (
            <Chip size="small" label={`UPI: ₹${result.paymentBreakdown.upi}`} variant="outlined" color="success" />
          )}
          {result.paymentBreakdown?.card > 0 && (
            <Chip size="small" label={`Card: ₹${result.paymentBreakdown.card}`} variant="outlined" color="primary" />
          )}
        </Box>

        <Divider sx={{ my: 1, opacity: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary' }}>
          <span>Invoices Paid: <b>{result.invoiceCount || 0}</b></span>
          <span>Appointments: <b>{result.appointmentsBooked || 0}</b></span>
          <span>Avg Ticket: <b>₹{result.averageTicketSize || 0}</b></span>
        </Box>
      </Paper>
    );
  }

  // 2. Upcoming Appointments Card
  if (name === 'getUpcomingAppointments') {
    const list = result.appointments || [];
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1.5,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={18} color="#6366f1" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Appointments ({result.date})
            </Typography>
          </Box>
          <Chip size="small" label={`${result.totalAppointments} Booked`} color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>

        {list.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            No appointments found for this date.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {list.slice(0, 5).map((apt: any) => (
              <Box
                key={apt.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#ffffff'),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {apt.customerName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={12} /> {apt.startTime} - {apt.endTime} • {apt.serviceName}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                    ₹{apt.price}
                  </Typography>
                  <Chip
                    size="small"
                    label={apt.status}
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      backgroundColor: apt.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: apt.status === 'CONFIRMED' ? '#10b981' : '#6366f1',
                    }}
                  />
                </Box>
              </Box>
            ))}
            {list.length > 5 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', pt: 0.5 }}>
                + {list.length - 5} more appointments
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  // 3. Staff On Duty Card
  if (name === 'getStaffOnDuty') {
    const staff = result.staff || [];
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1.5,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Users size={18} color="#0ea5e9" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Staff on Duty ({result.date})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip size="small" label={`${result.currentlyOnDuty} Working`} color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
            {result.onLeave > 0 && (
              <Chip size="small" label={`${result.onLeave} Leave`} color="warning" sx={{ height: 20, fontSize: '0.7rem' }} />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {staff.map((s: any) => {
            const isWorking = s.isWorking || s.status === 'ON_DUTY';
            return (
              <Box
                key={s.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#ffffff'),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {s.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Shift: {s.scheduledHours} {s.clockIn ? `• In: ${s.clockIn}` : ''}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  icon={isWorking ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  label={s.status.replace(/_/g, ' ')}
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    backgroundColor: isWorking
                      ? 'rgba(16, 185, 129, 0.15)'
                      : s.status === 'ON_LEAVE'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(148, 163, 184, 0.15)',
                    color: isWorking ? '#10b981' : s.status === 'ON_LEAVE' ? '#ef4444' : '#64748b',
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  }

  // 4. Appointment Booking Confirmation Card
  if (name === 'bookAppointment' && result.success) {
    const apt = result.appointment;
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1.5,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(240, 253, 244, 0.9)',
          border: '1px solid',
          borderColor: '#10b981',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CheckCircle2 size={18} color="#10b981" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10b981' }}>
            Appointment Booked Successfully
          </Typography>
        </Box>
        <Typography variant="body2">
          <b>Client:</b> {apt?.customerName} ({apt?.customerPhone})
        </Typography>
        <Typography variant="body2">
          <b>Service:</b> {apt?.serviceName} • ₹{apt?.price}
        </Typography>
        <Typography variant="body2">
          <b>Staff:</b> {apt?.staffName}
        </Typography>
        <Typography variant="body2">
          <b>Time:</b> {apt?.startAt ? new Date(apt.startAt).toLocaleString() : ''}
        </Typography>
      </Paper>
    );
  }

  // 5. Salon Services Catalog Card
  if (name === 'getSalonServices') {
    const services = result.services || [];
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1.5,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Scissors size={18} color="#8b5cf6" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Salon Services ({result.totalServices || services.length})
            </Typography>
          </Box>
          <Chip
            size="small"
            label={`${services.length} Listed`}
            color="secondary"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Box>

        {services.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            No services found matching your request.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {services.slice(0, 5).map((svc: any) => (
              <Box
                key={svc.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#ffffff',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {svc.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {svc.category?.name || svc.category || 'General'} • {svc.durationMinutes || svc.duration || 30} mins
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                  ₹{svc.price}
                </Typography>
              </Box>
            ))}
            {services.length > 5 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', pt: 0.5 }}>
                + {services.length - 5} more services
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  return null;
};
