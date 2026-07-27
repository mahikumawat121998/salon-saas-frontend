'use client';

import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiMenu, { MenuProps as MuiMenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export interface MenuItemConfig {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string | React.ReactNode;
  danger?: boolean;
  divider?: boolean;
  disabled?: boolean;
}

export interface MenuProps extends Omit<MuiMenuProps, 'children'> {
  items: MenuItemConfig[];
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  User: <User size={18} />,
  Settings: <Settings size={18} />,
  LogOut: <LogOut size={18} />,
};

export function Menu({ items, onClose, ...props }: MenuProps) {
  return (
    <MuiMenu
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '14px',
            minWidth: 200,
            mt: 1,
            boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.12)',
            p: 1,
          },
        },
      }}
      {...props}
    >
      {items.map((item, idx) => {
        if (item.divider) {
          return <Divider key={idx} sx={{ my: 0.5 }} />;
        }

        const iconNode =
          typeof item.icon === 'string' ? iconMap[item.icon] : item.icon;

        const menuItemContent = (
          <MenuItem
            key={idx}
            disabled={item.disabled}
            onClick={() => {
              if (item.onClick) item.onClick();
              onClose();
            }}
            sx={{
              borderRadius: '8px',
              py: 1,
              px: 1.5,
              fontSize: '0.875rem',
              fontWeight: 500,
              color: item.danger ? 'error.main' : 'text.primary',
              '&:hover': {
                backgroundColor: item.danger
                  ? 'rgba(239, 68, 68, 0.08)'
                  : undefined,
              },
            }}
          >
            {iconNode && (
              <ListItemIcon
                sx={{
                  color: item.danger ? 'error.main' : 'text.secondary',
                  minWidth: 32,
                }}
              >
                {iconNode}
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
          </MenuItem>
        );

        if (item.href) {
          return (
            <Link
              key={idx}
              href={item.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {menuItemContent}
            </Link>
          );
        }

        return menuItemContent;
      })}
    </MuiMenu>
  );
}

export default Menu;
