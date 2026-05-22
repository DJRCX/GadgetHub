import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearAdminCookie } from '@/lib/utils/adminCookie';

interface AuthState {
  isAdmin: boolean;
  customerName: string | null;
  customerEmail: string | null;
  setAdmin: (isAdmin: boolean) => void;
  loginCustomer: (payload: { name: string; email: string }) => void;
  logoutCustomer: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      customerName: null,
      customerEmail: null,
      setAdmin: (isAdmin) => set({ isAdmin }),
      loginCustomer: ({ name, email }) => set({ customerName: name, customerEmail: email }),
      logoutCustomer: () => set({ customerName: null, customerEmail: null }),
      logout: () => {
        clearAdminCookie();
        set({ isAdmin: false });
      },
    }),
    { name: 'auth-v1' }
  )
);
