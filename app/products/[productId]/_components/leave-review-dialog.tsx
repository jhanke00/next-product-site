'use client';

import { Form } from '@/src/components/ui/form';
import { useReviewForm } from '@/app/products/[productId]/_hooks/use-review-form';
import { useLeaveReview } from '@/app/products/[productId]/_hooks/use-leave-review';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { ReviewForm } from '@/app/products/[productId]/_components/review-form';

const ReviewDialog = () => {
  const { handleOpenChange, isOpen, handleOpen } = useLeaveReview();

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button type={'button'} onClick={handleOpen}>
          Leave Review
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Review</DialogTitle>
          <DialogDescription>What do you think?</DialogDescription>
        </DialogHeader>

        <ReviewForm />
      </DialogContent>
    </Dialog>
  );
};

export const LeaveReviewDialog = () => {
  const { methods } = useReviewForm();

  return (
    <Form {...methods}>
      <ReviewDialog />
    </Form>
  );
};
