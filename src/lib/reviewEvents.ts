import type { Server as IOServer } from 'socket.io';
import type { ReviewDocument } from '@/src/models/Review';

let io: IOServer | null = null;

export function registerSocketIO(server: IOServer) {
  io = server;
}

function sanitizeReview(review: any) {
  // Basic sanitization to avoid sending mongoose metadata
  const r = review.toObject ? review.toObject() : review;
  return {
    _id: r._id?.toString?.() ?? r._id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    helpfulYes: r.helpfulYes,
    helpfulNo: r.helpfulNo,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  } as ReviewDocument;
}

export function emitReviewCreated(review: any) {
  if (!io) return;
  io.emit('review:created', sanitizeReview(review));
}

export function emitReviewUpdated(review: any) {
  if (!io) return;
  io.emit('review:updated', sanitizeReview(review));
}

export function emitReviewDeleted(reviewId: string) {
  if (!io) return;
  io.emit('review:deleted', { _id: reviewId });
}
