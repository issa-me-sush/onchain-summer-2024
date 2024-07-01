import { NextResponse } from 'next/server';

const UNAUTHENTICATED_PAGES = ['/', '/refresh'];

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const cookieAuthToken = req.cookies.get('privy-token');
  const cookieSession = req.cookies.get('privy-session');

  // Allow unauthenticated access to specific pages
  if (UNAUTHENTICATED_PAGES.includes(url.pathname)) {
    return NextResponse.next();
  }

  // Bypass middleware when `privy_oauth_code` is a query parameter
  if (req.nextUrl.searchParams.get('privy_oauth_code')) {
    return NextResponse.next();
  }

  // Bypass middleware when the /refresh page is fetched to prevent infinite loop
  if (url.pathname === '/refresh') {
    return NextResponse.next();
  }

  // If the user has `privy-token`, they are authenticated
  const definitelyAuthenticated = Boolean(cookieAuthToken);

  // If user has `privy-session`, they may be authenticated after session refresh
  const maybeAuthenticated = Boolean(cookieSession);

  if (!definitelyAuthenticated && maybeAuthenticated) {
    // Redirect to `/refresh` page to trigger client-side session refresh
    url.pathname = '/refresh';
    url.searchParams.set('redirect_uri', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (!definitelyAuthenticated) {
    // Redirect unauthenticated users to login page
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/profile', '/open','/contribute'],
};
