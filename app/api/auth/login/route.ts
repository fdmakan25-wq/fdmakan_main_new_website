import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/lib/auth';
import { createTwoFactorChallenge } from '@/lib/auth-2fa';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Step 1: Validated credentials. Now initiate 2FA OTP sent to aman.fdmps@gmail.com
    const challenge = await createTwoFactorChallenge(email.trim().toLowerCase());

    if (!challenge.success) {
      return NextResponse.json(
        { error: challenge.error || 'Failed to dispatch verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        requires2FA: true,
        twoFactorToken: challenge.twoFactorToken,
        targetEmail: challenge.targetEmail,
        message: `A verification code has been sent to ${challenge.targetEmail}.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
