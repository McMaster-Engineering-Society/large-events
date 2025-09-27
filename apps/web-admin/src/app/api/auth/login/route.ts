import { NextRequest, NextResponse } from 'next/server';
import { validateUser, generateToken } from '../../../../lib/auth';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await validateUser(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      token
    });

    response.headers.set(
      'Set-Cookie',
      serialize('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/'
      })
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}