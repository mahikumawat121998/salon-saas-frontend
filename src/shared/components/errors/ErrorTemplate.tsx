import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export interface ErrorTemplateProps {
  code: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryAction: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  extraContent?: React.ReactNode;
}

export function ErrorTemplate({
  code,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  extraContent,
}: ErrorTemplateProps) {
  return (
    <Container maxWidth="sm">
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
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            p: { xs: 3, sm: 5 },
            width: '100%',
            boxShadow: '0px 10px 40px -10px rgba(0,0,0,0.05)',
            border: '1px solid #F3F4F6',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {code && (
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '3rem', sm: '4rem' },
                color: '#5B21B6',
                lineHeight: 1,
                mb: 2,
              }}
            >
              {code}
            </Typography>
          )}

          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800, mb: 1 }}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
            {description}
          </Typography>

          <Box
            sx={{
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              '& > svg': {
                width: '100%',
                height: '100%',
                color: '#5B21B6',
              },
            }}
          >
            {icon}
          </Box>

          {extraContent && <Box sx={{ width: '100%', mb: 4 }}>{extraContent}</Box>}

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {primaryAction.href ? (
              <Button
                component={Link}
                href={primaryAction.href}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  backgroundColor: '#5B21B6',
                  '&:hover': { backgroundColor: '#4C1D95' },
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                {primaryAction.label}
              </Button>
            ) : (
              <Button
                onClick={primaryAction.onClick}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  backgroundColor: '#5B21B6',
                  '&:hover': { backgroundColor: '#4C1D95' },
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              secondaryAction.href ? (
                <Button
                  component={Link}
                  href={secondaryAction.href}
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#D1D5DB',
                    },
                  }}
                >
                  {secondaryAction.label}
                </Button>
              ) : (
                <Button
                  onClick={secondaryAction.onClick}
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F9FAFB',
                      borderColor: '#D1D5DB',
                    },
                  }}
                >
                  {secondaryAction.label}
                </Button>
              )
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ErrorTemplate;
