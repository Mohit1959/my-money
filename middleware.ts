import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and API endpoints that don't need auth
  if (pathname === '/login' || pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Get the session token from cookies
  const token = request.cookies.get('session')?.value;

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the session
  const session = await verifySession(token);

  if (!session || !session.isAuthenticated || Date.now() > session.expiresAt) {
    // Invalid or expired session, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // Valid session, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
