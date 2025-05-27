import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { reviewFormSchema } from '@/app/products/[productId]/_schemas/review';
import { zodResolver } from '@hookform/resolvers/zod';

export const useReviewForm = () => {
  const methods = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    values: {
      review: '',
    },
  });

  return { methods };
};
