'use client';

import { notFound, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StarRating from '@/src/components/StarRating';
import AuthModal from '@/src/components/AuthModal';

const ProductDetail = ({ params }: { params: { productId: string } }) => {
  const searchParams = useSearchParams();
  const backQuery = searchParams?.toString();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [sort, setSort] = useState<'newest' | 'highest'>('newest');
  const [minRating, setMinRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState<{ rating: number; title: string; content: string }>({
    rating: 0,
    title: '',
    content: '',
  });
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [authUserName, setAuthUserName] = useState<string | null>(null);
  const [openReview, setOpenReview] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const productImage = (product as any)?.image as string | undefined;

  useEffect(() => {
    let cancelled = false;
    const id = params.productId;
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) return null;
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setProduct(json);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.name === 'AbortError') return;
        setProduct(null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [params.productId]);

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setAuthUserId(data.user.id);
            setAuthUserEmail(data.user.email);
            setAuthUserName(data.user.name || null);
          }
        }
      } catch (error) {
        // User not authenticated
      }
    };
    checkAuth();
  }, []);

  // Load reviews
  useEffect(() => {
    const id = params.productId;
    const controller = new AbortController();
    fetch(`/api/reviews?productId=${encodeURIComponent(id)}&sort=${sort}&minRating=${minRating}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        setReviews(json?.data || []);
        setReviewsTotal(json?.total || 0);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [params.productId, sort, minRating]);

  // Subscribe to SSE for real-time updates
  useEffect(() => {
    const id = params.productId;
    const es = new EventSource(`/api/reviews/stream?productId=${encodeURIComponent(id)}`);
    es.addEventListener('created', () => {
      // Refresh list on new review
      fetch(`/api/reviews?productId=${encodeURIComponent(id)}&sort=${sort}&minRating=${minRating}`)
        .then((res) => res.json())
        .then((json) => {
          setReviews(json?.data || []);
          setReviewsTotal(json?.total || 0);
        })
        .catch(() => {});
      // Also refresh product to reflect updated average rating
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((json) => setProduct(json))
        .catch(() => {});
    });
    es.addEventListener('moderated', () => {
      fetch(`/api/reviews?productId=${encodeURIComponent(id)}&sort=${sort}&minRating=${minRating}`)
        .then((res) => res.json())
        .then((json) => {
          setReviews(json?.data || []);
          setReviewsTotal(json?.total || 0);
        })
        .catch(() => {});
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((json) => setProduct(json))
        .catch(() => {});
    });
    es.addEventListener('helpful', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data)?.payload;
        if (payload?.id) {
          setReviews((prev) =>
            prev.map((r) => (r.id === payload.id ? { ...r, helpfulCount: payload.helpfulCount } : r))
          );
        }
      } catch {}
    });
    return () => {
      es.close();
    };
  }, [params.productId, sort, minRating]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center p-8'>
        <div className='text-gray-600'>Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center p-8'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center'>
          <h1 className='text-2xl font-bold text-red-500 mb-4'>Product Not Found</h1>
          <p className='text-gray-600 mb-6'>The product you're looking for doesn't exist or has been removed.</p>
          <Link href='/products' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='md:flex'>
            {/* Product Image */}
            <div className='md:flex-shrink-0 md:w-1/3 bg-gray-200 flex items-center justify-center p-8'>
              {productImage ? (
                <img src={productImage} alt={product.name} className='w-full h-auto object-contain max-h-80' />
              ) : (
                <div className='w-full h-64 bg-gray-300 flex items-center justify-center'>
                  <span className='text-gray-500'>No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className='p-8 md:w-2/3'>
              <div className='flex justify-between items-start'>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900 mb-2'>{product.name}</h1>
                  {product.category && (
                    <span className='inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4'>
                      {product.category}
                    </span>
                  )}
                </div>
                <Link
                  prefetch={false}
                  href={`/products${backQuery ? `?${backQuery}` : ''}`}
                  className='text-blue-500 hover:text-blue-700 cursor-pointer'
                >
                  ← Back to Products
                </Link>
              </div>

              <div className='mb-6'>
                <StarRating rating={product.rating || 0} size='lg' />
                <p className='text-sm text-gray-500 mt-1'>{product.numReviews || 0} customer reviews</p>
              </div>

              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-blue-600 mb-1'>${product.price}</h2>
                <p className='text-sm text-gray-500'>
                  {product.countInStock > 0 ? (
                    <span className='text-green-600'>In Stock ({product.countInStock} available)</span>
                  ) : (
                    <span className='text-red-600'>Out of Stock</span>
                  )}
                </p>
              </div>

              <div className='border-t border-gray-200 pt-6'>
                <h3 className='text-lg font-semibold mb-3'>Description</h3>
                <p className='text-gray-700 leading-relaxed mb-6'>{product.description}</p>
              </div>

              {/* Reviews Section */}
              <div className='border-t border-gray-200 pt-6 mt-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Customer Reviews</h3>
                  <div className='text-sm text-gray-500'>{reviewsTotal} reviews</div>
                </div>
                <div className='flex items-center space-x-4 mb-4'>
                  <label className='text-sm text-gray-600'>Sort:</label>
                  <select
                    className='border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 dark:bg-white dark:text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                  >
                    <option value='newest'>Newest</option>
                    <option value='highest'>Highest Rated</option>
                  </select>
                  <label className='text-sm text-gray-600'>Min rating:</label>
                  <select
                    className='border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 dark:bg-white dark:text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    value={minRating}
                    onChange={(e) => setMinRating(parseInt(e.target.value, 10))}
                  >
                    <option value={0}>All</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={5}>5</option>
                  </select>
                  {authUserId && (
                    <span className='ml-auto text-sm text-gray-600'>Signed in as {authUserName || authUserEmail}</span>
                  )}
                  {!openReview && (
                    <button
                      className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm'
                      onClick={() => {
                        if (authUserId) {
                          setOpenReview(true);
                        } else {
                          setShowAuthModal(true);
                        }
                      }}
                    >
                      Write a review
                    </button>
                  )}
                </div>

                {/* Review List */}
                <div className='space-y-4'>
                  {reviews.map((rev) => (
                    <div key={rev.id} className='border rounded p-4'>
                      <div className='flex items-center justify-between'>
                        <StarRating rating={rev.rating} size='md' />
                        <div className='text-xs text-gray-500'>{new Date(rev.createdAt).toLocaleString()}</div>
                      </div>
                      <div className='text-xs text-gray-600 mt-1'>By {rev.userName || 'Unknown user'}</div>
                      {rev.title && <div className='font-semibold mt-1'>{rev.title}</div>}
                      <p className='text-gray-700 mt-1'>{rev.content}</p>
                      <div className='mt-2 text-sm text-gray-600 flex items-center space-x-3'>
                        <button
                          className='text-blue-600 hover:text-blue-800'
                          onClick={() => {
                            fetch(`/api/reviews/${rev.id}/helpful`, { method: 'POST' })
                              .then((res) => res.json())
                              .then((json) => {
                                setReviews((prev) => prev.map((r) => (r.id === json.id ? json : r)));
                              })
                              .catch(() => {});
                          }}
                        >
                          Helpful ({rev.helpfulCount})
                        </button>
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && <div className='text-gray-500'>No reviews yet.</div>}
                </div>

                {/* Review Form */}
                <div className='mt-6'>
                  {!openReview ? null : (
                    <form
                      className='space-y-3'
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (submitting) return;
                        setSubmitting(true);
                        const payload = {
                          productId: params.productId,
                          rating: reviewForm.rating,
                          title: reviewForm.title,
                          content: reviewForm.content,
                        };
                        fetch('/api/reviews', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload),
                        })
                          .then((res) => res.json())
                          .then(() => {
                            setReviewForm({ rating: 0, title: '', content: '' });
                            setSubmitting(false);
                            setOpenReview(false);
                          })
                          .catch(() => setSubmitting(false));
                      }}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>Signed in as {authUserName || authUserEmail}</span>
                        <div className='flex items-center space-x-3'>
                          <button
                            type='button'
                            className='text-sm text-gray-600 hover:text-gray-800'
                            onClick={() => setOpenReview(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type='button'
                            className='text-sm text-red-600 hover:text-red-700'
                            onClick={async () => {
                              try {
                                await fetch('/api/auth/logout', { method: 'POST' });
                                setAuthUserId(null);
                                setAuthUserEmail(null);
                                setOpenReview(false);
                              } catch (error) {
                                console.error('Logout failed:', error);
                              }
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>Rating</label>
                        <div className='flex space-x-2 mt-1'>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type='button'
                              className={`text-2xl ${reviewForm.rating >= n ? 'text-yellow-400' : 'text-gray-300'}`}
                              onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>Title (optional)</label>
                        <input
                          className='mt-1 w-full border rounded px-3 py-2 bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-600'
                          placeholder='Add a short title'
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>Review</label>
                        <textarea
                          className='mt-1 w-full border rounded px-3 py-2 bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 caret-blue-600'
                          placeholder='Share your experience with this product'
                          rows={4}
                          value={reviewForm.content}
                          onChange={(e) => setReviewForm((f) => ({ ...f, content: e.target.value }))}
                        />
                      </div>
                      <button
                        type='submit'
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded'
                        disabled={submitting || reviewForm.rating === 0 || reviewForm.content.trim().length === 0}
                      >
                        Submit Review
                      </button>
                      <p className='text-xs text-gray-500 mt-2'>
                        In this demo, reviews appear immediately and are saved locally.
                      </p>
                    </form>
                  )}
                </div>

                <div className='mt-8 flex space-x-4'>
                  <button
                    className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex-1'
                    onClick={() => {
                      if (authUserId) {
                        // TODO: Implement cart functionality
                        alert('Added to cart! (Cart functionality not implemented yet)');
                      } else {
                        setShowAuthModal(true);
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className='border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg'>
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignedIn={(userId, email, name) => {
            setAuthUserId(userId);
            setAuthUserEmail(email);
            setAuthUserName(name || null);
            setShowAuthModal(false);
            setOpenReview(true);
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
