import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import ReviewModel from '@/src/models/Review';
import { getUserFromRequest } from '@/src/utils/auth';
import { hasPurchasedProduct } from '@/src/utils/orders';
import { emitReviewCreated } from '@/src/lib/reviewEvents';

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const sortParam = searchParams.get('sort') ?? 'newest';
  const minRating = Number(searchParams.get('minRating') ?? '0') || 0;

  if (!productId) {
    return NextResponse.json({ error: 'productId query param is required' }, { status: 400 });
  }

  let sort: Record<string, 1 | -1>;
  switch (sortParam) {
    case 'highest':
      sort = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sort = { rating: 1, createdAt: 1 };
      break;
    case 'helpful':
      sort = { helpfulYes: -1, createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'newest':
    default:
      sort = { createdAt: -1 };
  }

  const reviews = await ReviewModel.find({
    productId,
    status: 'approved',
    ...(minRating > 0 ? { rating: { $gte: minRating } } : {}),
  })
    .sort(sort)
    .lean()
    .exec();

  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { productId, rating, comment, title } = body;

  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: 'productId, rating, comment are required' }, { status: 400 });
  }

  if (!hasPurchasedProduct(user.id, productId)) {
    return NextResponse.json({ error: 'You can only review products you have purchased' }, { status: 403 });
  }

  const review = await ReviewModel.create({
    productId,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    rating,
    comment,
    title,
    status: 'pending', // require moderation
  });

  emitReviewCreated(review);

  return NextResponse.json(review, { status: 201 });
}
