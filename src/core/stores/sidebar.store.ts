import { create } from 'zustand';

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleOpen: () => void;
  toggleCollapse: () => void;
  setOpen: (isOpen: boolean) => void;
  setCollapsed: (isCollapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setOpen: (isOpen: boolean) => set({ isOpen }),
  setCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
}));
