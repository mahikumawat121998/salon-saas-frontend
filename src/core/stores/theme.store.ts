import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const getInitialMode = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem('salonos_theme_store');
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed?.state?.mode) return parsed.state.mode;
      }
    } catch (e) {}
  }
  return 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: getInitialMode(),
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        })),
      setMode: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: 'salonos_theme_store',
    }
  )
);
