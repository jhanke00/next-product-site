import { NextResponse } from 'next/server';
import { createUser, getUserById } from '@/src/server/auth/users';
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 6; // Minimum 6 characters
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword, name } = body;

    // Validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Email, password, and confirm password are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400, headers: CORS_HEADERS });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400, headers: CORS_HEADERS });
    }

    // Create user
    const result = await createUser({ email, password, name });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: CORS_HEADERS });
    }

    // Create session
    const token = createSession(result.userId!);

    const user = await getUserById(result.userId!);
    const response = NextResponse.json(
      {
        success: true,
        user: { id: user?._id || result.userId, email: user?.email || email, name: user?.name || name || undefined },
      },
      { status: 201, headers: CORS_HEADERS }
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS });
  }
}
