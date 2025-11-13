// @ts-nocheck - Temporary fix for drizzle-orm version conflicts in pnpm
import { eq } from 'drizzle-orm';
import { db, users } from '@large-event/database';
import type { AuthUser, AuthToken } from '@large-event/api-types';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function findUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}

export async function userExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return user !== null;
}

export async function validateUser(email: string): Promise<AuthUser | null> {
  try {
    const user = await findUserByEmail(email);
    return user;
  } catch (error) {
    console.error('Error validating user:', error);
    return null;
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    return null;
  }
}

export function getTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token') {
      return value;
    }
  }
  return null;
}