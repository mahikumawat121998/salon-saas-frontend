import { Components, Theme } from '@mui/material/styles';

export const cardOverride: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: '16px',
      boxShadow: theme.palette.mode === 'light'
        ? '0px 4px 20px rgba(15, 23, 42, 0.06)'
        : '0px 4px 20px rgba(0, 0, 0, 0.4)',
      border: `1px solid ${theme.palette.divider}`,
      backgroundImage: 'none',
      transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
    }),
  },
};

export const cardContentOverride: Components<Theme>['MuiCardContent'] = {
  styleOverrides: {
    root: {
      padding: '24px',
      '&:last-child': {
        paddingBottom: '24px',
      },
    },
  },
};
