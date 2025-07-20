import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { AuthSession } from '@/types/api';

const secretKey = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(password: string): Promise<string | null> {
  const correctPassword = process.env.AUTH_PASSWORD;

  if (!correctPassword || password !== correctPassword) {
    return null;
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session: AuthSession = {
    isAuthenticated: true,
    expiresAt: expiresAt.getTime(),
  };

  const token = await new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  return token;
}

export async function verifySession(
  token: string
): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    const session = payload as unknown as AuthSession;

    if (!session.isAuthenticated || Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('session');
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  }

  if (password.length < 1) {
    errors.push('Password cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isAuthenticated(session: AuthSession | null): boolean {
  return (
    session !== null &&
    session.isAuthenticated &&
    Date.now() < session.expiresAt
  );
}
