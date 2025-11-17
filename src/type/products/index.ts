export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  learningResources?: ProductResource[];
};

export type ProductResource = {
  productId: string;
  resourceId: string;
  name: string;
  description: string;
  resourceURI: string;
  popularityScore: number;
};
