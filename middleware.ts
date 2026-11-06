import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and /admin routes (except /admin/login)
  if (pathname.startsWith('/dashboard') || pathname === '/admin' || (pathname.startsWith('/admin') && pathname !== '/admin/login')) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminSession(token) : null;

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname === '/admin' ? '/dashboard' : pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If already authenticated and accessing /admin/login, redirect to /dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminSession(token) : null;

    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Protect mutating API routes (POST, PUT, DELETE, PATCH)
  // Allow public access to GET routes (viewing properties, blogs, etc.)
  // and exclude auth endpoints like /api/auth/* and /api/orders (enquiry submissions from users)
  const isApiRoute = pathname.startsWith('/api/');
  const isAuthRoute = pathname.startsWith('/api/auth/');
  const isPublicEnquiry = pathname.startsWith('/api/orders') && request.method === 'POST';

  if (isApiRoute && !isAuthRoute && !isPublicEnquiry) {
    const isMutatingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
    if (isMutatingMethod) {
      const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      const session = token ? await verifyAdminSession(token) : null;

      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin authentication required' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
