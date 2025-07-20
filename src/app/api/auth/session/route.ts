import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (
      !session ||
      !session.isAuthenticated ||
      Date.now() > session.expiresAt
    ) {
      return NextResponse.json(
        { success: false, message: 'No valid session' },
        { status: 401 }
      );
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
