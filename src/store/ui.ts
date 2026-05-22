import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  cartOpen: boolean;
  sidebarCollapsed: boolean;
  wishlistItems: string[];
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleWishlist: (productId: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      searchOpen: false,
      mobileMenuOpen: false,
      cartOpen: false,
      sidebarCollapsed: false,
      wishlistItems: [],
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleWishlist: (productId) => set((state) => ({
        wishlistItems: state.wishlistItems.includes(productId)
          ? state.wishlistItems.filter((id) => id !== productId)
          : [...state.wishlistItems, productId],
      })),
    }),
    { name: 'ui-store-v1' }
  )
);
