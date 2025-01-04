import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log('Token:', token); // Debugging: Log the token
  console.log('Pathname:', url.pathname); // Debugging: Log the pathname
  console.log('Cookies:', request.cookies.getAll()); // Debugging: Log all cookies

  // If the user is logged in and tries to access the sign-in or sign-up page, redirect them to the homepage or dashboard
  if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/conferences', request.url));
  }

  // If the user is not logged in and tries to access protected routes (e.g., /conferences, /users)
  if (!token && (url.pathname.startsWith('/conferences') || url.pathname.startsWith('/users'))) {
    // Redirect to the sign-in page with a callbackUrl to return to the original page after login
    const callbackUrl = url.pathname + url.search; // Include query parameters
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url));
  }

  // Allow the request to proceed if all checks pass
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/conferences/:path*',
    '/users/:path*',
    '/sign-in',
    '/sign-up',
  ],
};