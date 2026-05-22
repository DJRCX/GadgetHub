import { z } from 'zod';

export const orderStatusSchema = z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']);

export const orderUpdateSchema = z.object({
  status: orderStatusSchema,
});

export type OrderUpdateFormValues = z.infer<typeof orderUpdateSchema>;
