'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Sparkles } from 'lucide-react';
import { AiChatDrawer } from './AiChatDrawer';

export const AiFloatingTrigger: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 28 },
          right: { xs: 20, sm: 28 },
          zIndex: 1490,
        }}
      >
        <Tooltip title="Open Salon AI Copilot" placement="left" arrow>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: '28px',
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.2, sm: 1.4 },
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              transition: 'all 0.25s ease-in-out',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                boxShadow: '0 12px 30px rgba(99, 102, 241, 0.6)',
                transform: 'translateY(-3px) scale(1.02)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <Sparkles size={18} color="#ffffff" />
            </Box>
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              AI Copilot
            </Box>
          </Button>
        </Tooltip>
      </Box>

      <AiChatDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
