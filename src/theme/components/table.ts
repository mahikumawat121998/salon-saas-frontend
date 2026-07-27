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
    }),
    head: ({ theme }) => ({
      fontWeight: 600,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
      borderBottom: `2px solid ${theme.palette.divider}`,
    }),
  },
};

export const tableRowOverride: Components<Theme>['MuiTableRow'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      transition: 'background-color 0.15s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#334155',
      },
      '&:last-child td': {
        borderBottom: 0,
      },
    }),
  },
};
