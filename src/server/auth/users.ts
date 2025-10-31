import { getDb } from '@/src/server/db/mongo';
import { createHash, randomUUID } from 'crypto';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

export type User = {
  _id?: string;
  email: string;
  name?: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserData = {
  email: string;
  password: string;
  name?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

function hashPassword(password: string): string {
  return createHash('sha256')
    .update(password + process.env.PASSWORD_SALT || 'default-salt')
    .digest('hex');
}

// File-based fallback for local development when MongoDB is unavailable
const USERS_FILE = path.join(process.cwd(), 'src/mock/auth-users.json');

async function loadUsersFile(): Promise<User[]> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = await fsp.readFile(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw || '[]');
      if (Array.isArray(parsed)) return parsed as User[];
    }
  } catch {}
  return [];
}

async function persistUsersFile(users: User[]): Promise<void> {
  try {
    await fsp.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fsp.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch {}
}

export async function createUser(
  userData: CreateUserData
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const db = await getDb();
    if (!db) {
      // File fallback
      const users = await loadUsersFile();
      const existing = users.find((u) => u.email === userData.email.toLowerCase());
      if (existing) {
        return { success: false, error: 'User already exists' };
      }
      const newUser: User = {
        _id: randomUUID(),
        email: userData.email.toLowerCase(),
        name: userData.name?.toString().trim() || undefined,
        passwordHash: hashPassword(userData.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      await persistUsersFile(users);
      return { success: true, userId: newUser._id };
    }

    const users = db.collection<User>('users');
    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }
    // Create new user
    const user: Omit<User, '_id'> = {
      email: userData.email.toLowerCase(),
      name: userData.name?.toString().trim() || undefined,
      passwordHash: hashPassword(userData.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await users.insertOne(user);
    return { success: true, userId: result.insertedId.toString() };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function validateUser(
  credentials: LoginCredentials
): Promise<{ success: boolean; error?: string; userId?: string; user?: User }> {
  try {
    const db = await getDb();
    if (!db) {
      // File fallback
      const users = await loadUsersFile();
      const user = users.find((u) => u.email === credentials.email.toLowerCase());
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }
      const passwordHash = hashPassword(credentials.password);
      if (user.passwordHash !== passwordHash) {
        return { success: false, error: 'Invalid email or password' };
      }
      return { success: true, userId: user._id, user };
    }

    const users = db.collection<User>('users');
    const user = await users.findOne({ email: credentials.email.toLowerCase() });
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    const passwordHash = hashPassword(credentials.password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }
    return { success: true, userId: user._id?.toString(), user };
  } catch (error: any) {
    console.error('Error validating user:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDb();
    if (!db) {
      const users = await loadUsersFile();
      const user = users.find((u) => u._id === userId);
      return user || null;
    }
    const users = db.collection<User>('users');
    const user = await users.findOne({ _id: userId as any });
    return user;
  } catch (error: any) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}
