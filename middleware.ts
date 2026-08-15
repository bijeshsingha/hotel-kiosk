import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /pos routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/pos')) {
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAuthenticated = sessionToken === 'authenticated_staff_session';

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/pos/:path*'],
};
