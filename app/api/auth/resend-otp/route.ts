import { NextRequest, NextResponse } from 'next/server';
import { resendTwoFactorOTP } from '@/lib/auth-2fa';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`resend-otp:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many resend attempts. Please wait ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }

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

