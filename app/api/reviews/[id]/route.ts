import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import ReviewModel from '@/src/models/Review';
import { getUserFromRequest } from '@/src/utils/auth';
import { emitReviewUpdated, emitReviewDeleted } from '@/src/lib/reviewEvents';

type Params = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  const user = getUserFromRequest(req);

  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const review = await ReviewModel.findByIdAndUpdate(params.id, { status }, { new: true });

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  emitReviewUpdated(review);
  return NextResponse.json(review);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connectToDatabase();
  const user = getUserFromRequest(req);

  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const review = await ReviewModel.findByIdAndDelete(params.id);

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  emitReviewDeleted(params.id);
  return NextResponse.json({ success: true });
}
