export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  image?: string;
  stock?: number;
  rating?: number;
}
