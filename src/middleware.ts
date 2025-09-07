import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    
    // Allow access to public routes
    if (pathname.startsWith('/auth/') || pathname === '/') {
      return NextResponse.next()
    }

    // Redirect to sign-in if not authenticated and trying to access protected routes
    if (!token && pathname.startsWith('/dashboard')) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If authenticated and trying to access auth pages, redirect to dashboard
    if (token && pathname.startsWith('/auth/signin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow access to public routes
        if (pathname.startsWith('/auth/') || pathname === '/' || pathname.startsWith('/api/auth/')) {
          return true
        }
        
        // For protected routes, require authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}