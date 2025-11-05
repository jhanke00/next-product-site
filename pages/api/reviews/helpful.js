import connectToDatabase from '@/lib/mongodb';
import Review from '../../../models/Reviews';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await connectToDatabase();

  //   if (req.method !== 'POST') {
  //     return res.status(405).json({ message: 'Method not allowed' });
  //   }

  //   const token = req.headers.authorization?.split(' ')[1];
  //   if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = '12345';
    const { reviewId } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.voters.includes(userId)) {
      return res.status(400).json({ message: 'You already voted on this review' });
    }

    review.helpfulVotes += 1;
    review.voters.push(userId);
    await review.save();

    res.status(200).json({ message: 'Vote recorded', helpfulVotes: review.helpfulVotes });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
}
