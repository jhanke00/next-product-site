import { useCustomSearchParams } from '@/src/hooks/use-custom-search-params';
import { SEARCH_PARAMS_KEYS } from '@/src/constants/search-params-keys';
import { REVIEW_RATINGS } from '@/app/products/[productId]/_constants/review';

export const useReviewsRatingFilter = () => {
  const { setSearchParams, searchParams } = useCustomSearchParams();
  const rating = searchParams?.get(SEARCH_PARAMS_KEYS.rating) || REVIEW_RATINGS.all;

  const onRatingValueChange = (rating: string) => {
    setSearchParams([{ name: SEARCH_PARAMS_KEYS.rating, value: rating }]);
  };

  return { onRatingValueChange, rating };
};
