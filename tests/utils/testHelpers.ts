import usersData from '@mock/large/users.json';
import { NextRequest } from 'next/server';

export function getRandomUserId(): string {
  const randomIndex = Math.floor(Math.random() * usersData.length);
  return usersData[randomIndex].id;
}

export function createMockRequest(url: string, method: string = 'GET'): NextRequest {
  return new NextRequest(url, { method });
}
