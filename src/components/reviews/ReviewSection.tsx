'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ReviewForm from './ReviewForm';
import ReviewFilters from './ReviewFilters';
import ReviewList from './ReviewList';
import StarRatingDisplay from './StarRatingDisplay';
import type { Review } from '@/src/type/reviews';

// TEMP: demo user id; replace with real session userId
const CURRENT_USER_ID = 'a294bba5-a61f-40fc-bdaf-120886b3c4b2';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';

type Props = {
  productId: string;
};

export default function ReviewSection({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('newest');
  const [minRating, setMinRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function fetchReviews(nextSort = sort, nextMinRating = minRating) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        productId,
        sort: nextSort,
        ...(nextMinRating ? { minRating: String(nextMinRating) } : {}),
      });

      const res = await fetch(`/api/reviews?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load reviews');
      }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews('newest', 0);
    // init socket server (required for Next + socket.io pattern)
    fetch('/api/review-socket');
  }, [productId]);

  // WebSocket real-time updates
  useEffect(() => {
    const socket: Socket = io({
      path: '/api/review-socket',
    });

    socket.on('review:created', (review: Review) => {
      if (review.productId === productId) {
        // Only auto-inject if matches current filters
        setReviews((prev) => [review, ...prev]);
      }
    });

    socket.on('review:updated', (review: Review) => {
      setReviews((prev) => prev.map((r) => (r._id === review._id ? review : r)));
    });

    socket.on('review:deleted', ({ _id }: { _id: string }) => {
      setReviews((prev) => prev.filter((r) => r._id !== _id));
    });

    return () => {
      socket.disconnect();
    };
  }, [productId]);

  const stats = useMemo(() => {
    if (!reviews.length) return { average: 0, count: 0 };
    const count = reviews.length;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return { average: total / count, count };
  }, [reviews]);

  async function handleSubmit(form: { rating: number; title: string; comment: string }) {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': CURRENT_USER_ID,
      },
      body: JSON.stringify({
        productId,
        ...form,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to submit review');
    }

    // No need to manually push; socket will broadcast review:created
  }

  async function handleVoteHelpful(id: string, helpful: boolean) {
    const res = await fetch(`/api/reviews/${id}/helpful`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': CURRENT_USER_ID,
      },
      body: JSON.stringify({ helpful }),
    });

    if (!res.ok) {
      // basic error handling; keep it silent in UI
      console.error('Failed to record helpful vote');
    }
  }

  function handleSortChange(nextSort: SortOption) {
    setSort(nextSort);
    fetchReviews(nextSort, minRating);
  }

  function handleMinRatingChange(nextMin: number) {
    setMinRating(nextMin);
    fetchReviews(sort, nextMin);
  }

  return (
    <section className='mt-8 border-t pt-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Customer Reviews</h2>
          <p className='text-xs opacity-70'>
            {stats.count > 0 ? `${stats.count} review${stats.count > 1 ? 's' : ''}` : 'No reviews yet'}
          </p>
        </div>
        {stats.count > 0 && <StarRatingDisplay rating={stats.average} size='lg' />}
      </div>

      <ReviewFilters
        sort={sort}
        minRating={minRating}
        onSortChange={handleSortChange}
        onMinRatingChange={handleMinRatingChange}
      />

      <ReviewForm onSubmit={handleSubmit} disabled={!CURRENT_USER_ID} />

      {loading && <p className='text-sm opacity-70'>Loading reviews...</p>}
      {error && <p className='text-sm text-red-500'>{error}</p>}

      <ReviewList reviews={reviews} onVoteHelpful={handleVoteHelpful} />
    </section>
  );
}
