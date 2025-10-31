import { NextResponse } from 'next/server';
import { validateUser } from '@/src/server/auth/users';
import { createSession } from '@/src/server/auth/sessions';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400, headers: CORS_HEADERS });
    }

    // Validate credentials
    const result = await validateUser({ email, password });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401, headers: CORS_HEADERS });
    }

    // Create session
    const token = createSession(result.userId!);

    const response = NextResponse.json(
      { success: true, user: { id: result.userId, email: result.user?.email, name: result.user?.name } },
      { status: 200, headers: CORS_HEADERS }
    );

    // Set session cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
  }
}
