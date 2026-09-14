'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import { Scissors, Building2 } from 'lucide-react';
import { GuestGuard } from '@/shared/components/auth/GuestGuard';

export default function SelectTenantPage() {
  const [selectedTenant, setSelectedTenant] = useState('beauty_lounge');

  const tenants = [
    { id: 'beauty_lounge', name: 'Beauty Lounge', location: 'Jaipur, Rajasthan', active: true },
    { id: 'glam_studio', name: 'Glam Studio', location: 'Delhi, India', active: false },
    { id: 'looks_style', name: 'Looks & Style', location: 'Mumbai, Maharashtra', active: false },
    { id: 'hair_hub', name: 'The Hair Hub', location: 'Bangalore, Karnataka', active: false },
  ];

  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: '#FAF9FE',
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
        }}
      >
        {/* Header Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 8px 20px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Scissors size={24} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              SalonOS
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
              Salon Management System
            </Typography>
          </Box>
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            p: { xs: 3.5, sm: 4.5 },
            boxShadow: '0px 24px 60px rgba(124, 58, 237, 0.08), 0px 4px 16px rgba(0, 0, 0, 0.02)',
            border: '1px solid rgba(230, 232, 240, 0.8)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="#111827" sx={{ fontWeight: 800, mb: 1 }}>
            Select Your Organization
          </Typography>
          <Typography variant="body2" color="#6B7280" sx={{ fontSize: '0.875rem', mb: 3.5 }}>
            Choose the organization you want to access.
          </Typography>

          {/* Tenants Radio Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3.5 }}>
            {tenants.map((t) => {
              const isSelected = selectedTenant === t.id;
              return (
                <Box
                  key={t.id}
                  onClick={() => setSelectedTenant(t.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: '14px',
                    border: `1.5px solid ${isSelected ? '#7C3AED' : '#F3F4F6'}`,
                    backgroundColor: isSelected ? '#F3E8FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#7C3AED' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        backgroundColor: isSelected ? '#7C3AED' : '#F3F4F6',
                        color: isSelected ? '#FFFFFF' : '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={20} />
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.9rem' }}>
                          {t.name}
                        </Typography>
                        {t.active && (
                          <Chip label="Active" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontWeight: 800, height: 18, fontSize: '0.65rem' }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78125rem' }}>
                        {t.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Radio checked={isSelected} sx={{ color: '#D1D5DB', '&.Mui-checked': { color: '#7C3AED' } }} />
                </Box>
              );
            })}
          </Box>

          <Button
            component={Link}
            href="/select-outlet"
            fullWidth
            variant="contained"
            sx={{
              py: 1.4,
              borderRadius: '12px',
              backgroundColor: '#6D28D9',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0px 8px 20px rgba(109, 40, 217, 0.3)',
              mb: 2.5,
              '&:hover': { backgroundColor: '#5B21B6' },
            }}
          >
            Continue
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
            <Link href="#" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>
              Manage Organizations
            </Link>
          </Typography>
        </Box>
      </Box>
    </GuestGuard>
  );
}
