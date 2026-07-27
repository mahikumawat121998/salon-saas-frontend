import { PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#7C3AED', // Violet / Purple accent for luxury salon feel
    light: '#A78BFA',
    dark: '#5B21B6',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#EC4899', // Pink / Rose secondary accent
    light: '#F472B6',
    dark: '#BE185D',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    disabled: '#94A3B8',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#B45309',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#047857',
  },
  divider: '#E2E8F0',
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#8B5CF6',
    light: '#C4B5FD',
    dark: '#6D28D9',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F472B6',
    light: '#FBCFE8',
    dark: '#DB2777',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0F172A',
    paper: '#1E293B',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#DC2626',
  },
  warning: {
    main: '#FBBF24',
    light: '#FDE047',
    dark: '#D97706',
  },
  info: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#2563EB',
  },
  success: {
    main: '#34D399',
    light: '#6EE7B7',
    dark: '#059669',
  },
  divider: '#334155',
};
