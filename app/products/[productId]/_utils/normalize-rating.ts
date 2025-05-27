import { MAX_REVIEW_RATING } from '@/app/products/[productId]/_constants/review';
import { isNullish } from '@utils/is-nullish';

export const normalizeRating = (rating: number | null | undefined) => {
  if (isNullish(rating)) {
    return rating;
  }

  return Math.min(Math.round(rating), MAX_REVIEW_RATING);
};
