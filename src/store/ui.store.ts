import { create } from "zustand";

interface UiState {
  mobileNavOpen: boolean;
  sidebarExpanded: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  sidebarExpanded: false,
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
}));
