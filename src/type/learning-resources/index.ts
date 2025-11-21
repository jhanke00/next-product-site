export type LearningResource = {
  id: string;
  productId: string;
  title: string;
  description: string;
  url: string;
  type: 'guide' | 'tutorial' | 'video' | 'documentation';
  createdAt: string;
  updatedAt: string;
};

export type CreateLearningResourceInput = {
  productId: string;
  title: string;
  description: string;
  url: string;
  type: 'guide' | 'tutorial' | 'video' | 'documentation';
};

export type UpdateLearningResourceInput = Partial<Omit<CreateLearningResourceInput, 'productId'>>;
