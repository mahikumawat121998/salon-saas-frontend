import { Theme } from '@mui/material/styles';

export const datePickerOverrides: any = {
  MuiPickersLayout: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0px 10px 40px rgba(0, 0, 0, 0.6)'
          : '0px 10px 40px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }),
    },
  },
  MuiPickersPopper: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: '16px',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.palette.mode === 'dark'
          ? '0px 10px 40px rgba(0, 0, 0, 0.6)'
          : '0px 10px 40px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${theme.palette.divider}`,
        marginTop: '8px',
      }),
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        paddingTop: '16px',
        paddingBottom: '8px',
        paddingLeft: '24px',
        paddingRight: '24px',
        marginTop: 0,
        marginBottom: 0,
        color: theme.palette.text.primary,
      }),
      labelContainer: ({ theme }: { theme: Theme }) => ({
        fontSize: '0.875rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiDayCalendar: {
    styleOverrides: {
      header: {
        paddingTop: '8px',
        paddingBottom: '8px',
      },
      weekDayLabel: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.text.secondary,
        fontWeight: 600,
        fontSize: '0.75rem',
        width: '36px',
        height: '36px',
      }),
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        fontSize: '0.875rem',
        fontWeight: 500,
        color: theme.palette.text.primary,
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        margin: '2px',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.2)' : '#F3E8FF',
          color: theme.palette.primary.main,
        },
        '&.Mui-selected': {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: '#FFFFFF !important',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.dark} !important`,
          },
        },
      }),
      today: ({ theme }: { theme: Theme }) => ({
        border: 'none !important',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.25)' : '#F3E8FF',
        color: theme.palette.primary.main,
        fontWeight: 700,
      }),
    },
  },
  MuiClock: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
      clock: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB',
      }),
      pin: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.primary.main,
      }),
    },
  },
  MuiClockPointer: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.primary.main,
      }),
      thumb: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.primary.main,
        borderWidth: '4px',
      }),
    },
  },
  MuiClockNumber: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.text.primary,
        fontWeight: 500,
        fontSize: '0.875rem',
        '&.Mui-selected': {
          color: '#FFFFFF',
        },
      }),
    },
  },
};
