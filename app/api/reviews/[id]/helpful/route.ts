import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import ReviewModel from '@/src/models/Review';
import { getUserFromRequest } from '@/src/utils/auth';
import { emitReviewUpdated } from '@/src/lib/reviewEvents';

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { helpful } = body as { helpful: boolean };

  if (typeof helpful !== 'boolean') {
    return NextResponse.json({ error: 'helpful boolean is required' }, { status: 400 });
  }

  const update: any = helpful ? { $inc: { helpfulYes: 1 } } : { $inc: { helpfulNo: 1 } };

  const review = await ReviewModel.findByIdAndUpdate(params.id, update, { new: true });

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  emitReviewUpdated(review);
  return NextResponse.json(review);
}
