import { NextRequest, NextResponse } from 'next/server';
import { signAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { verifyTwoFactorOTP } from '@/lib/auth-2fa';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { twoFactorToken, otp } = body;

    if (!twoFactorToken || !otp) {
      return NextResponse.json(
        { error: 'Verification session and code are required' },
        { status: 400 }
      );
    }

    const verification = await verifyTwoFactorOTP({ twoFactorToken, otp });

    if (!verification.success) {
      return NextResponse.json(
        {
          error: verification.error || 'Invalid verification code',
          remainingAttempts: verification.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // OTP Verified! Now sign the actual admin session JWT
    const email = verification.email || 'admin@fdmakan.com';
    const token = await signAdminSession(email);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Two-factor authentication successful',
      },
      { status: 200 }
    );

    // Set secure HTTP-only admin session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error verifying authentication code' },
      { status: 500 }
    );
  }
}

