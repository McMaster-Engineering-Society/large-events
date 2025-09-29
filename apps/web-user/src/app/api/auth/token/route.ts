import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookie, generateToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request.headers.get('cookie'));

    if (!token) {
      const response = NextResponse.json({ error: 'No token provided' }, { status: 401 });
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3014');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3014');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      return response;
    }

    // Generate a fresh token for the team portal
    const freshToken = generateToken(decoded.user);

    const response = NextResponse.json({
      user: decoded.user,
      token: freshToken
    });

    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3014');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

    return response;
  } catch (error) {
    console.error('Token generation error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3014');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3014');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  return response;
}