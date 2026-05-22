import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, "Name is too short"),
  slug: z.string().min(3, "Slug is too short"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.coerce.number().min(0).optional().or(z.literal(0)),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
  specs: z.record(z.string(), z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isLatest: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
