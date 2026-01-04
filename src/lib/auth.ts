import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '@/lib/db/models';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  [key: string]: unknown; // Required for JWTPayload compatibility
}

export interface AuthUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  isActive?: boolean;
  lastLogin?: string;
}

// ============================================
// PASSWORD UTILITIES
// ============================================
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// JWT UTILITIES
// ============================================
export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// ============================================
// COOKIE UTILITIES
// ============================================
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getTokenFromCookies(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get('access_token')?.value || null,
    refreshToken: cookieStore.get('refresh_token')?.value || null,
  };
}

// ============================================
// AUTH MIDDLEWARE HELPERS
// ============================================
export async function getAuthFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  // First try Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Then try cookies
  const accessToken = request.cookies.get('access_token')?.value;
  if (accessToken) {
    return verifyToken(accessToken);
  }

  return null;
}

export function userToAuthUser(user: IUser): AuthUser {
  return {
    _id: user._id.toString(),
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    isActive: user.isActive,
    lastLogin: user.lastLogin?.toISOString(),
  };
}

