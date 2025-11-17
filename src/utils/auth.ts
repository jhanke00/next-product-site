import { NextRequest } from 'next/server';
import users from '@/src/mock/small/users.json';

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
};

export function getUserFromRequest(req: NextRequest): AuthUser | null {
  const userId = req.headers.get('x-user-id');
  if (!userId) return null;

  const user = (users as any[]).find((u) => u.id === userId);
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: true, // per requirement: consider all users as admin
  };
}
