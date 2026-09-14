import { Components, Theme } from '@mui/material/styles';

export const tableOverride: Components<Theme>['MuiTable'] = {
  styleOverrides: {
    root: {
      borderCollapse: 'separate',
      borderSpacing: '0',
    },
  },
};

export const tableCellOverride: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: '14px 16px',
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontSize: '0.875rem',
      color: theme.palette.text.primary,
    }),
    head: ({ theme }) => ({
      fontWeight: 600,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
      borderBottom: `1px solid ${theme.palette.divider}`,
    }),
  },
};

export const tableRowOverride: Components<Theme>['MuiTableRow'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      transition: 'background-color 0.15s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'light' ? '#F1F5F9' : 'rgba(255, 255, 255, 0.04)',
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(124, 58, 237, 0.06)' : 'rgba(139, 92, 246, 0.12)',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139, 92, 246, 0.18)',
        },
      },
      '&:last-child td': {
        borderBottom: 0,
      },
    }),
  },
};
