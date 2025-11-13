// Re-export types from existing type files
export type { Product as ProductType } from './products';
export type { User as UserType } from './users';
export type { Order as OrderType, Item as OrderItemType } from './orders';

// Minimal inline types
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  countInStock?: number;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { productId: string; qty: number; price: number }[];
  total: number;
  status?: string;
  createdAt?: string;
}
