import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development-only'
);

const COOKIE_NAME = 'baan-maa-auth';

// Routes that require authentication
const PROTECTED_ROUTES = ['/admin'];

// Routes within /admin that are public (login page)
const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires protection
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // Check if it's a public admin route (like login)
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // If not a protected route, allow through
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // If it's a public admin route, allow through
  if (isPublicAdminRoute) {
    return NextResponse.next();
  }

  // Get the auth cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Token is valid, allow through
    // We can add role-based checks here if needed
    const response = NextResponse.next();

    // Optionally add user info to headers for use in server components
    response.headers.set('x-user-id', payload.userId as string);
    response.headers.set('x-user-role', payload.role as string);

    return response;
  } catch {
    // Token is invalid or expired, redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);

    // Clear the invalid cookie
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_NAME);

    return response;
  }
}

export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Exclude static files and API routes from middleware
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
