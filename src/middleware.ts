import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simplified middleware for admin authentication and maintenance mode
 * - Checks for auth cookies on protected routes
 * - Checks maintenance mode for public pages
 * - Does NOT perform token verification (that's expensive and done server-side)
 * - Lets client-side handle the actual auth state
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Skip maintenance check for admin routes and maintenance page itself
  const isAdminRoute = pathname.startsWith('/admin');
  const isMaintenancePage = pathname === '/maintenance';

  // Check maintenance mode for public pages
  if (!isAdminRoute && !isMaintenancePage) {
    try {
      // Fetch settings to check maintenance mode
      const settingsUrl = new URL('/api/public/settings', request.url);
      const settingsResponse = await fetch(settingsUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (settingsData?.data?.maintenanceMode) {
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }
      }
    } catch {
      // If settings fetch fails, continue normally
    }
  }

  // If on maintenance page but maintenance is off, redirect to home
  if (isMaintenancePage) {
    try {
      const settingsUrl = new URL('/api/public/settings', request.url);
      const settingsResponse = await fetch(settingsUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (!settingsData?.data?.maintenanceMode) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch {
      // If settings fetch fails, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check for auth tokens
  const hasAccessToken = request.cookies.has('access_token');
  const hasRefreshToken = request.cookies.has('refresh_token');
  const hasAnyToken = hasAccessToken || hasRefreshToken;

  // Handle admin dashboard routes - require at least one token
  if (pathname.startsWith('/admin/dashboard')) {
    if (!hasAnyToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Handle login page - redirect to dashboard if has valid token
  if (pathname === '/admin/login') {
    if (hasAccessToken) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/admin/dashboard';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.next();
  }

  // Handle /admin root - redirect to login or dashboard
  if (pathname === '/admin') {
    if (hasAnyToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
