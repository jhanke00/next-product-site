import { createHash, randomBytes } from 'crypto';

export type Session = {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
};

// In-memory session store (for production, use Redis or database)
const sessions = new Map<string, Session>();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function createSession(userId: string): string {
  const token = generateToken();
  const now = Date.now();
  const session: Session = {
    token,
    userId,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  sessions.set(token, session);
  return token;
}

export function validateSession(token: string): { valid: boolean; userId?: string } {
  const session = sessions.get(token);
  if (!session) {
    return { valid: false };
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return { valid: false };
  }

  return { valid: true, userId: session.userId };
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}

// Cleanup expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
