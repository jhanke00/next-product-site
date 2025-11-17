'use client';

import { FormEvent, useState } from 'react';
import StarRatingInput from './StarRatingInput';

type Props = {
  onSubmit: (data: { rating: number; title: string; comment: string }) => Promise<void>;
  disabled?: boolean;
};

export default function ReviewForm({ onSubmit, disabled }: Props) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rating || !comment) {
      setError('Rating and comment are required');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ rating, title, comment });
      setRating(0);
      setTitle('');
      setComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='border rounded-lg p-4 my-4 flex flex-col gap-3'>
      <h3 className='text-lg font-semibold'>Write a review</h3>

      <div>
        <label className='block text-xs opacity-70 mb-1'>Rating</label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label className='block text-xs opacity-70 mb-1'>Title (optional)</label>
        <input
          className='w-full border rounded px-2 py-1 text-sm'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className='block text-xs opacity-70 mb-1'>Comment</label>
        <textarea
          className='w-full border rounded px-2 py-1 text-sm'
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className='text-xs text-red-500'>{error}</p>}

      <button
        type='submit'
        className='self-start px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60'
        disabled={submitting || disabled}
      >
        {submitting ? 'Submitting...' : 'Submit review'}
      </button>
      {disabled && (
        <p className='text-xs opacity-60 mt-1'>* You must be logged in and have purchased this product to review it.</p>
      )}
    </form>
  );
}
