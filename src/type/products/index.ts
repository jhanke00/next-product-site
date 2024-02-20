export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  rating: number;
  numReviews?: number;
  countInStock?: number;
  image: string;
  originalPrice: number;
};
