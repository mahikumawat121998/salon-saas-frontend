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
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
      color: theme.palette.text.primary,
      transition: 'all 0.2s ease-in-out',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.divider,
        borderWidth: '1px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '1.5px',
      },
    }),
    input: ({ theme }) => ({
      padding: '12px 14px',
      '&:-webkit-autofill': {
        WebkitBoxShadow: theme.palette.mode === 'dark' ? '0 0 0 100px #1E293B inset' : '0 0 0 100px #FFFFFF inset',
        WebkitTextFillColor: theme.palette.text.primary,
        caretColor: theme.palette.text.primary,
        borderRadius: 'inherit',
      },
    }),
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
