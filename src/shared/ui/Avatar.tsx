'use client';

import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import React from 'react';

export interface AvatarProps extends MuiAvatarProps {
  name?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const statusColors = {
  online: '#10B981',
  offline: '#94A3B8',
  busy: '#EF4444',
  away: '#F59E0B',
};

export function Avatar({ name, status, src, children, alt, sx, ...props }: AvatarProps) {
  const avatarContent = (
    <MuiAvatar
      src={src}
      alt={alt || name}
      sx={{
        fontWeight: 600,
        backgroundColor: (theme) => theme.palette.primary.light,
        color: (theme) => theme.palette.primary.contrastText,
        ...sx,
      }}
      {...props}
    >
      {children || (name ? getInitials(name) : null)}
    </MuiAvatar>
  );

  if (!status) return avatarContent;

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: statusColors[status],
            border: '2px solid white',
          }}
        />
      }
    >
      {avatarContent}
    </Badge>
  );
}
