import { useQueryState } from '@/src/hooks/use-query-state';
import { STORE_KEYS } from '@/src/constants/store-keys';

export const useReviewDialog = (initialData?: boolean) => {
  const { setState, data: value } = useQueryState<boolean>({
    queryKey: STORE_KEYS.reviewTooltipOpen,
    initialData,
  });

  const setReviewTooltipOpen = (value: boolean) => {
    setState(value);
  };

  return { value, setReviewTooltipOpen };
};
