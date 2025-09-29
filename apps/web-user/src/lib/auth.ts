import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthToken {
  user: AuthUser;
  exp: number;
  iat: number;
}

// Simple mock user validation for demonstration
// In production, this would connect to your actual database
const validUsers = [
  { id: 1, email: 'admin@example.com' },
  { id: 2, email: 'test@example.com' },
  { id: 3, email: 'user@large-event.com' },
  { id: 4, email: 'demo@test.com' }
];

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  // Simulate database lookup
  await new Promise(resolve => setTimeout(resolve, 100));
  const user = validUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
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

export function getTokenFromCookie(cookieHeader: string | null | undefined): string | null {
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