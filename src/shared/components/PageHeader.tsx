'use client';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, fontSize: '0.875rem' }}>
          {breadcrumbs.map((crumb, idx) =>
            crumb.href ? (
              <Link key={idx} underline="hover" color="inherit" href={crumb.href}>
                {crumb.label}
              </Link>
            ) : (
              <Typography key={idx} color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 500 }}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" color="text.primary" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>{action}</Box>}
      </Box>
    </Box>
  );
}
