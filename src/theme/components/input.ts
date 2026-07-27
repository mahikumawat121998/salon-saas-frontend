import { Components, Theme } from '@mui/material/styles';

export const textFieldOverride: Components<Theme>['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
    size: 'medium',
  },
};

export const outlinedInputOverride: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: '10px',
      transition: 'all 0.2s ease-in-out',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#334155',
        borderWidth: '1.5px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    }),
    input: {
      padding: '12px 14px',
    },
  },
};

export const inputLabelOverride: Components<Theme>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontWeight: 500,
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    }),
  },
};
