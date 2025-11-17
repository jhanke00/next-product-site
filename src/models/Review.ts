import { Schema, model, models } from 'mongoose';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewDocument {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  helpfulYes: number;
  helpfulNo: number;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

const ReviewSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    helpfulYes: { type: Number, default: 0 },
    helpfulNo: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = models.Review || model('Review', ReviewSchema);
export default ReviewModel;
