import { NextRequest, NextResponse } from 'next/server';
import { resendTwoFactorOTP } from '@/lib/auth-2fa';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { twoFactorToken } = body;

    if (!twoFactorToken) {
      return NextResponse.json(
        { error: 'Verification session token is required' },
        { status: 400 }
      );
    }

    const result = await resendTwoFactorOTP({ twoFactorToken });

    if (!result.success) {
      const status = result.retryAfterSeconds ? 429 : 400;
      return NextResponse.json(
        {
          error: result.error || 'Failed to resend verification code',
          retryAfterSeconds: result.retryAfterSeconds,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'A new 6-digit verification code has been sent.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error while resending verification code' },
      { status: 500 }
    );
  }
}

