import { NextResponse } from 'next/server';
import { addReview, listReviews } from '@/src/utils/reviews';
import { getUserById } from '@/src/server/auth/users';
import { ReviewCreateInput } from '@/src/type/products/reviews/types';
import { validateSession } from '@/src/server/auth/sessions';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, x-user-id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400, headers: CORS_HEADERS });
    }
    const sort = (searchParams.get('sort') as 'newest' | 'highest') || 'newest';
    const minRating = parseInt(searchParams.get('minRating') || '0', 10) || 0;
    const statusParam = searchParams.get('status') || 'approved_only';
    const result = await listReviews(productId, { sort, minRating, status: statusParam as any });
    // Enrich reviews with user display name when available
    if (Array.isArray(result?.data) && result.data.length > 0) {
      const uniqueUserIds = Array.from(new Set(result.data.map((r: any) => r.userId).filter(Boolean)));
      const userMap: Record<string, string | undefined> = {};
      for (const uid of uniqueUserIds) {
        const user = await getUserById(uid);
        userMap[uid] = user?.name;
      }
      result.data = result.data.map((r: any) => ({ ...r, userName: userMap[r.userId] }));
    }
    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Read auth-token from cookies and validate session
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return [name, value];
      })
    );
    const token = cookies['auth-token'];
    const session = token ? validateSession(token) : { valid: false };
    if (!session.valid || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
    }
    const data = (await req.json()) as ReviewCreateInput;
    if (!data?.productId || !data?.content || !data?.rating) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400, headers: CORS_HEADERS });
    }
    const created = await addReview(session.userId, data);
    return NextResponse.json(created, { status: 201, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
