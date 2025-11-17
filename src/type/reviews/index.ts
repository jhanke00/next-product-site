export type Review = {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  helpfulYes: number;
  helpfulNo: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
};
