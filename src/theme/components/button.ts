import { Components, Theme } from '@mui/material/styles';

export const buttonOverride: Components<Theme>['MuiButton'] = {
  styleOverrides: {
    root: {
      borderRadius: '10px',
      textTransform: 'none',
      fontWeight: 600,
      padding: '8px 18px',
      boxShadow: 'none',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0px 4px 12px rgba(124, 58, 237, 0.25)',
        transform: 'translateY(-1px)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    },
    contained: {
      '&.MuiButton-containedPrimary': {
        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
        },
      },
      '&.MuiButton-containedSecondary': {
        background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)',
        },
      },
    },
    outlined: {
      borderWidth: '1.5px',
      '&:hover': {
        borderWidth: '1.5px',
      },
    },
    sizeSmall: {
      padding: '6px 12px',
      fontSize: '0.8125rem',
      borderRadius: '8px',
    },
    sizeLarge: {
      padding: '12px 24px',
      fontSize: '1rem',
      borderRadius: '12px',
    },
  },
};
