'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <FileQuestion size={48} />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '4rem', sm: '6rem' },
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
          The page you are looking for does not exist or might have been moved to a new location.
        </Typography>

        <Button
          component={Link}
          href="/dashboard"
          variant="contained"
          size="large"
          startIcon={<Home size={20} />}
          sx={{ borderRadius: '12px', px: 3, py: 1.2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
