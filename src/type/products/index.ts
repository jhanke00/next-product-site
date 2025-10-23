export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
};

export type LearningResource = {
  id: string;
  productId: string;
  title: string;
  type: 'tutorial' | 'guide' | 'video' | 'course' | 'other';
  url?: string;
  description?: string;
  createdAt?: string;
};
