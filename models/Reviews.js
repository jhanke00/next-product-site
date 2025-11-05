import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: 'User' },
    productId: { type: String, required: true, ref: 'Product' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    helpfulVotes: { type: Number, default: 0 },
    voters: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
