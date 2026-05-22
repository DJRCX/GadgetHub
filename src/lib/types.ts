export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  parentId?: string;
  isSpecific?: boolean;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  discountPercent?: number; // Computed field
  categoryId: string;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  isFeatured?: boolean;
  isLatest?: boolean;
  isBestSeller?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  ctaLabel?: string;
  sortOrder?: number;
  position: 'hero-main' | 'hero-side';
  language?: 'en' | 'bn';
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket';
  transactionId?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}
