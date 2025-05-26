import { apiClient } from '@/src/config/trpc/react';
import { useParams } from 'next/navigation';
import { useReviewDialog } from '@/app/products/[productId]/_store/use-review-dialog';
import { useToast } from '@/src/hooks/use-toast';
import { useFormContext } from 'react-hook-form';
import { ReviewFormSchema } from '@/app/products/[productId]/_types/review';

type Params = {
  productId: string;
};

export const useLeaveReview = () => {
  const createReview = apiClient.review.createReview.useMutation();

  const params = useParams<Params>();

  const { setReviewTooltipOpen: setIsOpen, value: isOpen } = useReviewDialog(false);

  const { toast } = useToast();

  const form = useFormContext<ReviewFormSchema>();

  async function onSubmit(data: ReviewFormSchema) {
    if (!params) {
      return;
    }

    const rating = Number(data.rating) || undefined;

    await createReview.mutateAsync({
      productId: params.productId,
      rating,
      review: data.review,
    });

    toast({
      title: 'Thank you!',
      description: (
        <div>
          <p>Your review has been submitted. It will be published after content review</p>
        </div>
      ),
      duration: 5000,
    });

    handleClose();
  }

  const handleSubmit = form.handleSubmit(onSubmit);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      form.reset();
    }
  };

  return { form, handleOpenChange, handleOpen, handleSubmit, isOpen, handleClose };
};
