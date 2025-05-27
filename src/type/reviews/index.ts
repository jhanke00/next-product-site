import { IUser } from '@type/users';

export type IReview = {
  id: string;
  product: string;
  rating: number | null;
  review: string | null;
  createdAt: string;
  user: Pick<IUser, 'lastName' | 'firstName' | 'id' | 'email'> | null;
};
