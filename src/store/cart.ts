import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartError: () => string | null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.productId === item.productId);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: Math.min(item.quantity, item.stock) }] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((i) => i.productId !== productId),
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((i) => {
          if (i.productId === productId) {
            return { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) };
          }
          return i;
        }),
      })),
      clearCart: () => set({ items: [] }),
      getCartError: () => {
        const items = get().items;
        if (items.length === 0) return 'Cart is empty';
        for (const item of items) {
          if (item.quantity > item.stock) {
            return `Insufficient stock for ${item.name}`;
          }
        }
        return null;
      },
    }),
    { name: 'cart-v1' }
  )
);
