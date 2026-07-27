'use client';

import MuiBreadcrumbs, { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends MuiBreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
}

export function Breadcrumb({ items, showHomeIcon = true, sx, ...props }: BreadcrumbProps) {
  return (
    <MuiBreadcrumbs
      separator={<ChevronRight size={14} />}
      aria-label="breadcrumb"
      sx={{
        fontSize: '0.875rem',
        '& .MuiBreadcrumbs-li': {
          display: 'flex',
          alignItems: 'center',
        },
        ...sx,
      }}
      {...props}
    >
      {showHomeIcon && (
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Home size={15} />
        </Link>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast || !item.href) {
          return (
            <Typography
              key={index}
              color="text.primary"
              sx={{ fontSize: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              {item.icon}
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            href={item.href}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}

export default Breadcrumb;
