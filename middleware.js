import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();

  // Supabase Auth with vanilla supabase-js stores auth token in cookies by default in Next.js 
  // Wait, standard supabase-js client doesn't automatically sync to cookies unless configured.
  // The easiest check for now is looking for standard Supabase auth cookie `sb-access-token` or `sb-<project-id>-auth-token`
  // We can also just check if there's any cookie starting with `sb-`
  const supabaseCookies = req.cookies.getAll().filter(c => c.name.startsWith('sb-'));
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

  const isAuthenticated = supabaseCookies.length > 0;

  if (isDashboardPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
