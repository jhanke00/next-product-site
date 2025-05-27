import { z } from 'zod';

export const reviewFormSchema = z.object({
  review: z.string().min(1, {
    message: 'Feedback must be at least 1 character.',
  }),
  rating: z.string().optional(),
});
