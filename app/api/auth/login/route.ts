import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, STAFF_CREDENTIALS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === STAFF_CREDENTIALS.username && password === STAFF_CREDENTIALS.password) {
      const response = NextResponse.json({ success: true, message: 'Authentication successful' });

      // Set HTTP-only secure cookie
      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: 'authenticated_staff_session',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 hours staff session
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid staff username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
