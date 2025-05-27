'use client';

import { useLeaveReview } from '@/app/products/[productId]/_hooks/use-leave-review';
import { useUser } from '@/src/hooks/use-user';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { REVIEW_RATINGS } from '@/app/products/[productId]/_constants/review';
import { RatingStar } from '@/app/products/[productId]/_components/rating-star';
import { Textarea } from '@components/ui/textarea';
import { Skeleton } from '@components/ui/skeleton';
import { cn } from '@/src/utils';
import { Button, buttonVariants } from '@components/ui/button';
import { CircleUserRound } from 'lucide-react';

export const ReviewForm = () => {
  const { handleSubmit, handleClose, form } = useLeaveReview();

  const { isLoggedIn, isLoading } = useUser();

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-2'>
      <FormField
        control={form.control}
        name='rating'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rating</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className='bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-white/50 transition-all'>
                  <SelectValue placeholder='Select rating' />
                </SelectTrigger>
              </FormControl>
              <SelectContent className='bg-white/95 backdrop-blur-sm border border-purple-100'>
                <SelectItem value={REVIEW_RATINGS['0']} className='focus:bg-purple-50 transition-colors'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-500'>-</span>
                  </div>
                </SelectItem>

                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem
                    key={rating}
                    value={REVIEW_RATINGS[rating as keyof typeof REVIEW_RATINGS]}
                    className='focus:bg-purple-50 transition-colors'
                  >
                    <div className='flex items-center gap-2'>
                      <div className='flex'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <RatingStar key={star} isActive={star <= rating} />
                        ))}
                      </div>
                      <span className='text-gray-700 font-medium'>{rating}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='review'
        render={({ field }) => (
          <FormItem className={'pb-2.5'}>
            <FormLabel>Review</FormLabel>
            <FormControl>
              <Textarea placeholder='Tell us what do you think' className='resize-none' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isLoading && <Skeleton className={cn(buttonVariants(), 'text-transparent w-full')}>Leave Review</Skeleton>}

      {!isLoading && (
        <>
          {isLoggedIn ? (
            <Button type={'submit'} className={'w-full'} loading={form.formState.isSubmitting}>
              Submit
            </Button>
          ) : (
            <div className='flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg'>
              <div className='mb-4 bg-indigo-400 p-3 rounded-full'>
                <CircleUserRound />
              </div>
              <p className='text-black text-lg font-medium mb-2 text-center'>Please log in to submit a review</p>
            </div>
          )}
        </>
      )}

      <Button type='button' className={'w-full'} variant='secondary' onClick={handleClose}>
        Close
      </Button>
    </form>
  );
};
