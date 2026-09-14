import { createTheme, Theme } from '@mui/material/styles';
import { breakpoints } from './breakpoints';
import { components } from './components';
import { darkPalette } from './palette';
import { darkShadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const darkTheme: Theme = createTheme({
  palette: darkPalette,
  typography,
  shadows: darkShadows,
  spacing,
  breakpoints,
  components,
  shape: {
    borderRadius: 10,
  },
});
