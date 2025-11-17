// app/admin/reviews/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/src/type/reviews';

// TEMP: demo user id (same as ReviewSection)
const CURRENT_USER_ID = 'a294bba5-a61f-40fc-bdaf-120886b3c4b2';

type FilterStatus = 'pending' | 'approved' | 'rejected';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('pending');
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    setLoading(true);
    const params = new URLSearchParams({
      status: statusFilter,
    });

    const res = await fetch(`/api/admin/reviews?${params.toString()}`, {
      headers: {
        'x-user-id': CURRENT_USER_ID,
      },
    });

    if (!res.ok) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  async function updateStatus(id: string, status: FilterStatus) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': CURRENT_USER_ID,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      loadReviews();
    }
  }

  async function deleteReview(id: string) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': CURRENT_USER_ID,
      },
    });

    if (res.ok) {
      loadReviews();
    }
  }

  return (
    <main className='flex min-h-screen flex-col p-8 gap-4'>
      <h1 className='text-2xl font-semibold'>Review Moderation</h1>

      <div className='flex items-center gap-4'>
        <label className='text-sm'>
          Status filter:{' '}
          <select
            className='border rounded px-2 py-1 text-sm'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          >
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </label>
      </div>

      {loading && <p className='text-sm opacity-70'>Loading reviews...</p>}

      <div className='flex flex-col gap-3 mt-4'>
        {reviews.map((r) => (
          <div key={r._id} className='border rounded p-3 text-sm'>
            <div className='flex justify-between'>
              <div>
                <div className='font-semibold'>{r.title || '(No title)'}</div>
                <div className='opacity-70'>
                  {r.userName} — {r.rating.toFixed(1)}★
                </div>
              </div>
              <div className='text-xs opacity-60 self-start'>{new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <p className='mt-2'>{r.comment}</p>
            <div className='mt-2 text-xs opacity-70'>
              Helpful: {r.helpfulYes} / Not helpful: {r.helpfulNo}
            </div>
            <div className='mt-3 flex gap-2'>
              <button className='px-2 py-1 border rounded text-xs' onClick={() => updateStatus(r._id, 'approved')}>
                Approve
              </button>
              <button className='px-2 py-1 border rounded text-xs' onClick={() => updateStatus(r._id, 'rejected')}>
                Reject
              </button>
              <button
                className='px-2 py-1 border rounded text-xs text-red-600 border-red-600'
                onClick={() => deleteReview(r._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && !reviews.length && <p className='text-sm opacity-70'>No reviews for this filter.</p>}
      </div>
    </main>
  );
}
