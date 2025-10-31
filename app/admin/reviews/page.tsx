'use client';

import { useEffect, useState } from 'react';

export default function AdminReviews() {
  const [adminEnabled, setAdminEnabled] = useState(false);
  const [productId, setProductId] = useState('1');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/reviews?productId=${encodeURIComponent(productId)}&status=pending`)
      .then((res) => res.json())
      .then((json) => setReviews(json?.data || []))
      .catch(() => {});
  }, [productId]);

  const moderate = (id: string, status: 'approved' | 'rejected') => {
    if (!adminEnabled) return;
    fetch(`/api/reviews/${id}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin': 'true' },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        // Refresh pending list
        fetch(`/api/reviews?productId=${encodeURIComponent(productId)}&status=pending`)
          .then((res) => res.json())
          .then((json) => setReviews(json?.data || []))
          .catch(() => {});
      });
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-3xl mx-auto bg-white p-6 rounded shadow'>
        <h1 className='text-2xl font-bold mb-4'>Admin Review Moderation</h1>
        <div className='flex items-center space-x-3 mb-4'>
          <label className='text-sm text-gray-700'>Admin Mode:</label>
          <button
            className={`px-3 py-1 rounded ${adminEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setAdminEnabled((v) => !v)}
          >
            {adminEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>Product ID</label>
          <input
            className='mt-1 border rounded px-3 py-2'
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </div>
        <div className='space-y-3'>
          {reviews.map((r) => (
            <div key={r.id} className='border rounded p-3'>
              <div className='text-sm text-gray-500'>{new Date(r.createdAt).toLocaleString()}</div>
              <div className='font-semibold'>Rating: {r.rating}</div>
              {r.title && <div className='font-medium'>{r.title}</div>}
              <p className='text-gray-700'>{r.content}</p>
              <div className='mt-2 flex space-x-3'>
                <button
                  className='bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50'
                  disabled={!adminEnabled}
                  onClick={() => moderate(r.id, 'approved')}
                >
                  Approve
                </button>
                <button
                  className='bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50'
                  disabled={!adminEnabled}
                  onClick={() => moderate(r.id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <div className='text-gray-500'>No pending reviews.</div>}
        </div>
      </div>
    </div>
  );
}
