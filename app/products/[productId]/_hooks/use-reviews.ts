import { Product } from '@type/products';
import { useSearchParams } from 'next/navigation';
import { SEARCH_PARAMS_KEYS } from '@/src/constants/search-params-keys';
import { DEFAULT_REVIEW_PAGE, REVIEW_RATINGS, REVIEWS_PER_PAGE } from '@/app/products/[productId]/_constants/review';
import { apiClient } from '@/src/config/trpc/react';

type ReviewsParams = {
  productId: Product['id'];
};

export const useReviews = (params: ReviewsParams) => {
  const { productId } = params;

  const searchParams = useSearchParams();

  const ratingFromSearchParams = searchParams?.get(SEARCH_PARAMS_KEYS.rating) || REVIEW_RATINGS.all;
  const pageFromSearchParams = Number(searchParams?.get(SEARCH_PARAMS_KEYS.page) || DEFAULT_REVIEW_PAGE);

  const payloadRating = ratingFromSearchParams !== REVIEW_RATINGS.all ? Number(ratingFromSearchParams) : undefined;
  const offset = (pageFromSearchParams - 1) * REVIEWS_PER_PAGE;

  const { data, isFetching } = apiClient.review.getReviews.useQuery({
    productId,
    rating: payloadRating,
    limit: REVIEWS_PER_PAGE,
    offset,
  });

  const { count: totalReviewsCount = 0, reviews = [] } = data ?? {};

  const pagesTotal = Math.ceil(totalReviewsCount / REVIEWS_PER_PAGE);

  const shouldShowPagination = pagesTotal > 1;
  const shouldShowReviews = !!reviews.length;

  return {
    page: pageFromSearchParams,
    totalReviewsCount,
    shouldShowPagination,
    reviews,
    isFetching,
    shouldShowReviews,
  };
};
