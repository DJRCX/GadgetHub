import { z } from 'zod';

export const checkoutShippingSchema = z.object({
  customerName: z.string().min(2, "Name is too short"),
  phone: z.string().regex(/^\+8801[3-9]\d{8}$/, "Invalid Bangladeshi phone number (e.g. +8801700000000)"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

export type CheckoutShippingFormValues = z.infer<typeof checkoutShippingSchema>;
