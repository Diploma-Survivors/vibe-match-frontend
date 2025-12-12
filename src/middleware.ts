import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // -----------------------------------------------------------------------
  // 1. THE RECEPTIONIST (Main Middleware Function)
  // This ONLY runs if the "authorized" callback below returns true.
  // Its job is to handle redirects for users who are ALREADY allowed in.
  // -----------------------------------------------------------------------
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // UX Enhancement:
    // If the user is ALREADY logged in (has token), but they are visiting
    // a login or auth page, redirect them to the dashboard/home.
    if (token && (pathname === '/login' || pathname.startsWith('/auth'))) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },

  // -----------------------------------------------------------------------
  // 2. THE SECURITY GUARD (Callback)
  // This runs FIRST. Its job is strictly Access Control (Yes/No).
  // -----------------------------------------------------------------------
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // A. Define Public Routes
        // These return TRUE (Access Granted) for everyone
        if (
          pathname === '/' ||
          pathname.startsWith('/auth') || // e.g. /auth/login, /auth/register
          pathname === '/login' || // Custom login page
          pathname.startsWith('/api') // Let API routes handle their own auth
        ) {
          return true;
        }

        // B. Define Protected Routes
        // For everything else, return TRUE only if token exists.
        // If this returns FALSE, NextAuth automatically redirects to /login
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
