import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import ReviewModel from '@/src/models/Review';
import { getUserFromRequest } from '@/src/utils/auth';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const user = getUserFromRequest(req);

  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'pending';

  const reviews = await ReviewModel.find({ status }).sort({ createdAt: -1 }).lean().exec();

  return NextResponse.json({ reviews });
}
