import { z } from 'zod';
import { reviewFormSchema } from '@/app/products/[productId]/_schemas/review';

export type ReviewFormSchema = z.infer<typeof reviewFormSchema>;
