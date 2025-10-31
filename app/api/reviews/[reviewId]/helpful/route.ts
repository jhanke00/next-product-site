import { NextResponse } from 'next/server';
import { voteHelpful } from '@/src/utils/reviews';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(_req: Request, context: { params: { reviewId: string } }) {
  try {
    const id = context?.params?.reviewId;
    const updated = await voteHelpful(id);
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
