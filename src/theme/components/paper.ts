import { Components, Theme } from '@mui/material/styles';

export const paperOverride: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundImage: 'none',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    }),
  },
};

export const drawerOverride: Components<Theme>['MuiDrawer'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      backgroundImage: 'none',
      backgroundColor: theme.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF',
      color: theme.palette.text.primary,
      borderColor: theme.palette.divider,
    }),
  },
};

export const dialogOverride: Components<Theme>['MuiDialog'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      backgroundImage: 'none',
      backgroundColor: theme.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.palette.mode === 'dark'
        ? '0px 20px 50px rgba(0, 0, 0, 0.6)'
        : '0px 20px 50px rgba(15, 23, 42, 0.12)',
    }),
  },
};

export const menuOverride: Components<Theme>['MuiMenu'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      backgroundImage: 'none',
      backgroundColor: theme.palette.mode === 'dark' ? '#1B2436' : '#FFFFFF',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.palette.mode === 'dark'
        ? '0px 10px 30px rgba(0, 0, 0, 0.5)'
        : '0px 10px 30px rgba(15, 23, 42, 0.08)',
    }),
  },
};

export const chipOverride: Components<Theme>['MuiChip'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontWeight: 600,
    }),
  },
};

export const dividerOverride: Components<Theme>['MuiDivider'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderColor: theme.palette.divider,
    }),
  },
};
