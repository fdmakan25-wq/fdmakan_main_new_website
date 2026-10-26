import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'admin_session_token';

const getSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET || 'fdmakan_admin_jwt_secret_fallback_2026';
  return new TextEncoder().encode(secret);
};

export interface AdminSession {
  email: string;
  role: 'admin';
}

/**
 * Sign a new JWT session token for Admin
 */
export async function signAdminSession(email: string): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verify a given JWT session token
 */
export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === 'admin' && typeof payload.email === 'string') {
      return {
        email: payload.email,
        role: 'admin',
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate incoming request for Admin session
 */
export async function getAdminSessionFromRequest(req: NextRequest): Promise<AdminSession | null> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return null;
  return verifyAdminSession(cookie);
}

/**
 * Helper to check credentials directly against environment variables
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL || 'admin@fdmakan.com';
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    console.error('CRITICAL: ADMIN_PASSWORD is not set in environment variables');
    return false;
  }

  return (
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    password === expectedPassword
  );
}
