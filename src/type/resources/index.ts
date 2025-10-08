export type ResourceType = 'Article' | 'Video' | 'Guide' | 'Course' | 'Reference';

export type LearningResource = {
  id: string;
  productId: string;
  title: string;
  type: ResourceType;
  url: string;
  description?: string;
  estimatedMinutes?: number;
  createdAt: string;
};

export type LearningResourceInput = {
  productId: string;
  title: string;
  type?: ResourceType;
  url: string;
  description?: string;
  estimatedMinutes?: number;
};
