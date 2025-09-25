import { NextResponse } from 'next/server';
import { getUserById } from '@utils/users';
import { getCachedData, setCachedData } from '@utils/cache';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const cacheKey = `user_${params.userId}`;
  let user = getCachedData(cacheKey);

  if (!user) {
    user = await getUserById(params.userId);
    if (user) {
      setCachedData(cacheKey, user);
    }
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}
