import { createTheme, Theme } from '@mui/material/styles';
import { breakpoints } from './breakpoints';
import { components } from './components';
import { lightPalette } from './palette';
import { lightShadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme: Theme = createTheme({
  palette: lightPalette,
  typography,
  shadows: lightShadows,
  spacing,
  breakpoints,
  components,
  shape: {
    borderRadius: 10,
  },
});
