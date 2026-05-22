import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Step = 1 | 2 | 3 | 4;

interface CheckoutState {
  currentStep: Step;
  shipping: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    postalCode: string;
  } | null;
  paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket' | null;
  isLoading: boolean;
  setStep: (step: Step) => void;
  setShipping: (shipping: CheckoutState['shipping']) => void;
  setPaymentMethod: (method: CheckoutState['paymentMethod']) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      currentStep: 1,
      shipping: null,
      paymentMethod: null,
      isLoading: false,
      setStep: (step) => set({ currentStep: step }),
      setShipping: (shipping) => set({ shipping }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => set({ currentStep: 1, shipping: null, paymentMethod: null, isLoading: false }),
    }),
    { name: 'checkout-step-v1' }
  )
);
