import { Components, Theme } from '@mui/material/styles';

export const datePickerOverrides: Components<Theme> = {
  MuiPickersLayout: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      },
    },
  },
  MuiPickersPopper: {
    styleOverrides: {
      paper: {
        borderRadius: '16px',
        boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.08)',
        border: 'none',
        marginTop: '8px',
      },
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      root: {
        paddingTop: '16px',
        paddingBottom: '8px',
        paddingLeft: '24px',
        paddingRight: '24px',
        marginTop: 0,
        marginBottom: 0,
      },
      labelContainer: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#111827',
      },
      switchViewButton: {
        display: 'none', // Hide switch view button if we want to match the simple design, but probably good to keep it or just restyle
      },
    },
  },
  MuiDayCalendar: {
    styleOverrides: {
      header: {
        paddingTop: '8px',
        paddingBottom: '8px',
      },
      weekDayLabel: {
        color: '#6B7280',
        fontWeight: 600,
        fontSize: '0.75rem',
        width: '36px',
        height: '36px',
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        margin: '2px',
        '&:hover': {
          backgroundColor: '#F3E8FF',
          color: '#6D28D9',
        },
        '&.Mui-selected': {
          backgroundColor: '#6D28D9 !important',
          color: '#FFFFFF !important',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#5B21B6 !important',
          },
        },
      },
      today: {
        border: 'none !important',
        backgroundColor: '#F3E8FF',
        color: '#6D28D9',
        fontWeight: 700,
      },
    },
  },
  MuiClock: {
    styleOverrides: {
      root: {
        backgroundColor: '#FFFFFF',
      },
      clock: {
        backgroundColor: '#F9FAFB', // Light gray background for clock face
      },
      pin: {
        backgroundColor: '#6D28D9',
      },
    },
  },
  MuiClockPointer: {
    styleOverrides: {
      root: {
        backgroundColor: '#6D28D9',
      },
      thumb: {
        backgroundColor: '#FFFFFF',
        borderColor: '#6D28D9',
        borderWidth: '4px',
      },
    },
  },
  MuiClockNumber: {
    styleOverrides: {
      root: {
        color: '#374151',
        fontWeight: 500,
        fontSize: '0.875rem',
        '&.Mui-selected': {
          color: '#FFFFFF',
        },
      },
    },
  },
};
