'use client';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  helpfulCount: number;
  createdAt: string; // ISO
  status: ReviewStatus;
}

export interface ReviewCreateInput {
  productId: string;
  rating: number;
  title?: string;
  content: string;
}

export interface ReviewListResult {
  data: Review[];
  total: number;
}
