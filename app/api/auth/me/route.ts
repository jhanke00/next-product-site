import { NextResponse } from 'next/server';
import { validateSession } from '@/src/server/auth/sessions';
import { getUserById } from '@/src/server/auth/users';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return [name, value];
      })
    );
    const token = cookies['auth-token'];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers: CORS_HEADERS });
    }

    const session = validateSession(token);
    if (!session.valid) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers: CORS_HEADERS });
    }

    const user = await getUserById(session.userId!);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401, headers: CORS_HEADERS });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500, headers: CORS_HEADERS });
  }
}
