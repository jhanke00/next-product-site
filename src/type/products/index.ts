export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  imageUrl?: string;
};

export type LearningResource = {
  id: string;
  title: string;
  type: 'tutorial' | 'guide' | 'training' | 'video' | 'pdf';
  duration?: string;
  description?: string;
  files?: {
    id: string;
    name: string;
    url: string;
    type: 'video' | 'pdf';
  }[];
  createdAt?: Date;
};

export type ActiveIngredient = {
  name: string;
  description: string;
  percentage?: number;
};

export type ProductDetails = Product & {
  detailedDescription?: string;
  usageInstructions?: string;
  activeIngredients?: ActiveIngredient[];
  learningResources?: LearningResource[];
  customGuide?: string;
  manufacturingSite?: {
    name: string;
    location: string;
    plantsCount: number;
    activeIngredientsCount: number;
    intermediatesCount: number;
  };
};
