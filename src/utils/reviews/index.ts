import { Review, ReviewCreateInput, ReviewListResult, ReviewStatus } from '@/src/type/products/reviews/types';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { getDb } from '@/src/server/db/mongo';

// Persistent storage paths
const REVIEWS_FILE = path.join(process.cwd(), 'src/mock/reviews.json');
const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src/mock/overrides/products.json');

// Load reviews from disk once at module init
let reviews: Review[] = [];
try {
  if (fs.existsSync(REVIEWS_FILE)) {
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      reviews = parsed as Review[];
    }
  }
} catch {
  reviews = [];
}
// Fallback demo reviews if file missing/corrupt
if (!reviews.length) {
  reviews = [
    {
      id: 'r-1',
      productId: '1',
      userId: 'u-100',
      rating: 5,
      title: 'Fantastic!',
      content: 'Loved it. Great quality and fast delivery.',
      helpfulCount: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'approved',
    },
    {
      id: 'r-2',
      productId: '1',
      userId: 'u-101',
      rating: 4,
      title: 'Solid value',
      content: 'Good product, would recommend.',
      helpfulCount: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      status: 'approved',
    },
    {
      id: 'r-3',
      productId: '2',
      userId: 'u-102',
      rating: 2,
      title: 'Not what I expected',
      content: 'Quality could be better.',
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      status: 'pending',
    },
  ];
}

async function persistReviews() {
  try {
    await fsp.mkdir(path.dirname(REVIEWS_FILE), { recursive: true });
    await fsp.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch {}
}

async function updateProductOverridesFromReviewsFile(productId: string) {
  // Compute aggregates from approved reviews
  const approved = reviews.filter((r) => r.productId === productId && r.status === 'approved');
  const numReviews = approved.length;
  const rating = numReviews ? approved.reduce((sum, r) => sum + (r.rating || 0), 0) / numReviews : 0;
  const payload = { rating, numReviews };
  try {
    await fsp.mkdir(path.dirname(PRODUCT_OVERRIDES_FILE), { recursive: true });
    let current: Record<string, any> = {};
    if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
      const raw = await fsp.readFile(PRODUCT_OVERRIDES_FILE, 'utf-8');
      current = JSON.parse(raw || '{}') || {};
    }
    current[productId] = { ...(current[productId] || {}), ...payload };
    await fsp.writeFile(PRODUCT_OVERRIDES_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch {}
}

async function updateProductOverridesFromDb(productId: string) {
  const db = await getDb();
  if (!db) return updateProductOverridesFromReviewsFile(productId);
  const coll = db.collection('reviews');
  await ensureIndexes(coll);
  const approvedCursor = coll.find({ productId, status: 'approved' }, { projection: { rating: 1 } });
  const approved = await approvedCursor.toArray();
  const numReviews = approved.length;
  const rating = numReviews ? approved.reduce((sum, r: any) => sum + (r.rating || 0), 0) / numReviews : 0;
  const payload = { rating, numReviews };
  try {
    await fsp.mkdir(path.dirname(PRODUCT_OVERRIDES_FILE), { recursive: true });
    let current: Record<string, any> = {};
    if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
      const raw = await fsp.readFile(PRODUCT_OVERRIDES_FILE, 'utf-8');
      current = JSON.parse(raw || '{}') || {};
    }
    current[productId] = { ...(current[productId] || {}), ...payload };
    await fsp.writeFile(PRODUCT_OVERRIDES_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch {}
}

// Minimal event emitter for SSE broadcasts
type Listener = (event: { type: string; payload: any }) => void;
const listenersByProduct = new Map<string, Set<Listener>>();

function emit(productId: string, type: string, payload: any) {
  const listeners = listenersByProduct.get(productId);
  if (!listeners) return;
  for (const l of listeners) {
    try {
      l({ type, payload });
    } catch {}
  }
}

export function subscribe(productId: string, listener: Listener) {
  let set = listenersByProduct.get(productId);
  if (!set) {
    set = new Set();
    listenersByProduct.set(productId, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
    if (set && set.size === 0) listenersByProduct.delete(productId);
  };
}

export async function listReviews(
  productId: string,
  options?: { sort?: 'newest' | 'highest'; minRating?: number; status?: ReviewStatus | 'approved_only' }
): Promise<ReviewListResult> {
  const { sort = 'newest', minRating = 0, status = 'approved_only' } = options || {};
  const db = await getDb();
  if (!db) {
    // File fallback
    let data = reviews.filter((r) => r.productId === productId && r.rating >= minRating);
    if (status === 'approved_only') data = data.filter((r) => r.status === 'approved');
    else if (status) data = data.filter((r) => r.status === status);
    if (sort === 'newest') {
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'highest') {
      data.sort((a, b) => b.rating - a.rating);
    }
    return { data, total: data.length };
  }
  const coll = db.collection('reviews');
  const query: any = { productId, rating: { $gte: Number(minRating) || 0 } };
  if (status === 'approved_only') query.status = 'approved';
  else if (status) query.status = status;
  // Use string-based SortDirection to satisfy MongoDB driver types
  const sortSpec = sort === 'highest' ? { rating: 'descending' } : { createdAt: 'descending' };
  const cursor = coll.find(query).sort(sortSpec);
  const docs = await cursor.toArray();
  const data: Review[] = docs.map((d: any) => ({
    id: d.id,
    productId: d.productId,
    userId: d.userId,
    rating: d.rating,
    title: d.title,
    content: d.content,
    helpfulCount: d.helpfulCount || 0,
    createdAt: d.createdAt,
    status: d.status,
  }));
  return { data, total: data.length };
}

export async function addReview(userId: string, input: ReviewCreateInput): Promise<Review> {
  const id = `r-${Math.random().toString(36).slice(2, 10)}`;
  const review: Review = {
    id,
    productId: input.productId,
    userId,
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    title: input.title,
    content: input.content,
    helpfulCount: 0,
    createdAt: new Date().toISOString(),
    // Auto-approve in demo so rating updates immediately and persists
    status: 'approved',
  };
  const db = await getDb();
  if (!db) {
    // File fallback
    reviews.push(review);
    persistReviews();
    await updateProductOverridesFromReviewsFile(input.productId);
    emit(input.productId, 'created', review);
    return review;
  }
  const coll = db.collection('reviews');
  await ensureIndexes(coll);
  await coll.insertOne(review as any);
  await updateProductOverridesFromDb(input.productId);
  emit(input.productId, 'created', review);
  return review;
}

export async function voteHelpful(reviewId: string): Promise<Review | null> {
  const db = await getDb();
  if (!db) {
    const r = reviews.find((rev) => rev.id === reviewId);
    if (!r) return null;
    r.helpfulCount += 1;
    persistReviews();
    emit(r.productId, 'helpful', { id: r.id, helpfulCount: r.helpfulCount });
    return r;
  }
  const coll = db.collection('reviews');
  await ensureIndexes(coll);
  const updated = await coll.findOneAndUpdate(
    { id: reviewId },
    { $inc: { helpfulCount: 1 } },
    { returnDocument: 'after' }
  );
  if (!updated || !updated.value) return null;
  const r = updated.value as any;
  emit(r.productId, 'helpful', { id: r.id, helpfulCount: r.helpfulCount || 0 });
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    rating: r.rating,
    title: r.title,
    content: r.content,
    helpfulCount: r.helpfulCount || 0,
    createdAt: r.createdAt,
    status: r.status,
  };
}

export async function moderateReview(reviewId: string, status: ReviewStatus): Promise<Review | null> {
  const db = await getDb();
  if (!db) {
    const r = reviews.find((rev) => rev.id === reviewId);
    if (!r) return null;
    r.status = status;
    persistReviews();
    await updateProductOverridesFromReviewsFile(r.productId);
    emit(r.productId, 'moderated', { id: r.id, status });
    return r;
  }
  const coll = db.collection('reviews');
  await ensureIndexes(coll);
  const updated = await coll.findOneAndUpdate({ id: reviewId }, { $set: { status } }, { returnDocument: 'after' });
  if (!updated || !updated.value) return null;
  const r = updated.value as any;
  await updateProductOverridesFromDb(r.productId);
  emit(r.productId, 'moderated', { id: r.id, status });
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    rating: r.rating,
    title: r.title,
    content: r.content,
    helpfulCount: r.helpfulCount || 0,
    createdAt: r.createdAt,
    status: r.status,
  };
}
let indexesEnsured = false;
async function ensureIndexes(coll: any) {
  if (indexesEnsured) return;
  try {
    await coll.createIndexes([
      { key: { id: 1 }, name: 'id_unique', unique: true },
      { key: { productId: 1, createdAt: -1 }, name: 'product_createdAt' },
      { key: { productId: 1, rating: -1 }, name: 'product_rating' },
      { key: { status: 1 }, name: 'status_idx' },
    ]);
    indexesEnsured = true;
  } catch {}
}
