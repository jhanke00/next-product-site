import { NextResponse } from 'next/server';
import { moderateReview } from '@/src/utils/reviews';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-admin',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request, context: { params: { reviewId: string } }) {
  try {
    const isAdmin = req.headers.get('x-admin') === 'true';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: CORS_HEADERS });
    }
    const id = context?.params?.reviewId;
    const body = await req.json();
    const status = body?.status as 'approved' | 'rejected' | 'pending';
    if (!status) {
      return NextResponse.json({ error: 'status required' }, { status: 400, headers: CORS_HEADERS });
    }
    const updated = await moderateReview(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json(updated, { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
