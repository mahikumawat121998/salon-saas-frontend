'use client';

import { useThemeStore } from '@/core/stores/theme.store';
import { darkTheme, lightTheme } from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React, { createContext, useContext, useSyncExternalStore } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  mode: ColorMode;
  toggleColorMode: () => void;
  setMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  setMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode, toggleTheme, setMode } = useThemeStore();

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const activeMode = isHydrated ? mode : 'light';
  const activeTheme = activeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ColorModeContext.Provider
      value={{
        mode: activeMode,
        toggleColorMode: toggleTheme,
        setMode,
      }}
    >
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
