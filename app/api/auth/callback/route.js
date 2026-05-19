import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        auth: {
          flowType: 'pkce',
          persistSession: false,
        }
      }
    );

    // Exchange the authorization code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.session) {
      const response = NextResponse.redirect(new URL('/dashboard', request.url));
      
      // Set standard cookies manually so middleware can intercept authenticated state server-side
      response.cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.session.expires_in,
      });

      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.session.expires_in,
      });

      return response;
    } else {
      console.error("Exchange code error:", error);
    }
  }

  // Fallback if failed
  return NextResponse.redirect(new URL('/auth?error=exchange_failed', request.url));
}
