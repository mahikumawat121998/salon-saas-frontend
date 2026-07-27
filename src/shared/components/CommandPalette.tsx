'use client';

import { MAIN_NAVIGATION } from '@/config/navigation';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {
  Calendar,
  Clock,
  LayoutDashboard,
  Plus,
  Scissors,
  Search,
  Settings,
  UserCheck,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const navCommands: CommandItem[] = MAIN_NAVIGATION.map((nav) => ({
    id: nav.path,
    title: nav.title,
    category: 'Navigation',
    icon:
      nav.icon === 'Calendar' ? (
        <Calendar size={18} />
      ) : nav.icon === 'Scissors' ? (
        <Scissors size={18} />
      ) : nav.icon === 'Users' ? (
        <Users size={18} />
      ) : nav.icon === 'UserCheck' ? (
        <UserCheck size={18} />
      ) : nav.icon === 'Settings' ? (
        <Settings size={18} />
      ) : nav.icon === 'Clock' ? (
        <Clock size={18} />
      ) : (
        <LayoutDashboard size={18} />
      ),
    action: () => {
      router.push(nav.path);
      onClose();
    },
  }));

  const actionCommands: CommandItem[] = [
    {
      id: 'new-appointment',
      title: 'Book New Appointment',
      category: 'Actions',
      icon: <Plus size={18} />,
      action: () => {
        router.push('/dashboard/appointments/new');
        onClose();
      },
    },
    {
      id: 'new-client',
      title: 'Add New Client',
      category: 'Actions',
      icon: <Plus size={18} />,
      action: () => {
        router.push('/dashboard/customers/new');
        onClose();
      },
    },
    {
      id: 'new-service',
      title: 'Add New Service',
      category: 'Actions',
      icon: <Plus size={18} />,
      action: () => {
        router.push('/dashboard/services/new');
        onClose();
      },
    },
  ];

  const allCommands = [...navCommands, ...actionCommands];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)' },
        },
        paper: {
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            border: (t) => `1px solid ${t.palette.divider}`,
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          gap: 1.5,
        }}
      >
        <Search size={20} style={{ opacity: 0.6 }} />
        <InputBase
          autoFocus
          fullWidth
          placeholder="Type a command or search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ fontSize: '1rem', fontWeight: 500 }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          ESC
        </Typography>
      </Box>

      <Box sx={{ maxHeight: 400, overflowY: 'auto', p: 1 }}>
        {filteredCommands.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">No matching commands found.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredCommands.map((cmd) => (
              <ListItemButton
                key={cmd.id}
                onClick={cmd.action}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 1.5,
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                  {cmd.icon}
                </ListItemIcon>
                <ListItemText
                  primary={cmd.title}
                  slotProps={{ primary: { sx: { fontSize: '0.9375rem', fontWeight: 500 } } }}
                />
                <Typography variant="caption" color="text.secondary">
                  {cmd.category}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Dialog>
  );
}

export default CommandPalette;
