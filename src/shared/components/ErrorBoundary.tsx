'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4,
              borderRadius: '24px',
              backgroundColor: 'background.paper',
              border: (t) => `1px solid ${t.palette.divider}`,
              boxShadow: '0px 20px 40px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '20px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AlertOctagon size={36} />
            </Box>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message ||
                'An unexpected application error occurred. Please try again.'}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<RotateCcw size={18} />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
