import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { cookies } from 'next/headers';
import type { JWTPayload, Role } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-only'
);

const COOKIE_NAME = 'baan-maa-auth';
const JWT_EXPIRY = '7d';

// =============================================================================
// Password Utilities
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =============================================================================
// JWT Utilities
// =============================================================================

export async function createToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
  return new SignJWT(payload as unknown as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// =============================================================================
// Cookie Utilities
// =============================================================================

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// =============================================================================
// Session Utilities
// =============================================================================

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<JWTPayload> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

// =============================================================================
// Role Helpers
// =============================================================================

export function canManageDogs(role: Role): boolean {
  return ['ADMIN', 'EDITOR', 'DOG_MANAGER'].includes(role);
}

export function canManageEvents(role: Role): boolean {
  return ['ADMIN', 'EDITOR'].includes(role);
}

export function canManageProjects(role: Role): boolean {
  return ['ADMIN', 'EDITOR'].includes(role);
}

export function canManageUsers(role: Role): boolean {
  return role === 'ADMIN';
}

export function canManageStories(role: Role): boolean {
  return ['ADMIN', 'EDITOR'].includes(role);
}

export function canManageAppeals(role: Role): boolean {
  return ['ADMIN', 'EDITOR'].includes(role);
}

export function isAdmin(role: Role): boolean {
  return role === 'ADMIN';
}
