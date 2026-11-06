import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { Resend } from 'resend';
import { getDatabase } from './mongodb';

export const ADMIN_2FA_TARGET_EMAIL =
  process.env.ADMIN_2FA_EMAIL?.trim() || 'aman.fdmps@gmail.com';

const OTP_EXPIRY_MINUTES = 10;
const MAX_VERIFY_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 45;

const getSecretKey = () => {
  const secret = process.env.NEXTAUTH_SECRET || 'fdmakan_admin_jwt_secret_fallback_2026';
  return new TextEncoder().encode(secret);
};

function hashOtp(otp: string, salt: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fdmakan_admin_jwt_secret_fallback_2026';
  return crypto
    .createHmac('sha256', secret)
    .update(`${otp.trim()}:${salt}`)
    .digest('hex');
}

function generateOtp(): string {
  // Generates secure 6-digit numeric OTP (e.g. 100000 to 999999)
  return crypto.randomInt(100000, 1000000).toString();
}

function buildOtpEmailHtml(otp: string, adminEmail: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1320; padding: 40px 16px; min-height: 100%;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #111c2e; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
        <!-- Header -->
        <tr>
          <td style="padding: 32px 32px 20px; text-align: center; background: linear-gradient(135deg, #0F2942 0%, #1e3a5f 100%); border-bottom: 1px solid #1e293b;">
            <div style="display: inline-block; padding: 8px 18px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 10px; margin-bottom: 14px;">
              <span style="font-size: 16px; font-weight: 800; color: #ffffff; letter-spacing: 2px;">FD MAKAN</span>
            </div>
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
              Admin Two-Factor Authentication
            </h1>
            <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px;">
              Secure verification code for Dashboard access
            </p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 32px 32px 24px;">
            <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              A sign-in request was initiated for administrator account:
              <br/>
              <strong style="color: #38bdf8; font-family: monospace; font-size: 13px;">${adminEmail}</strong>
            </p>

            <p style="margin: 0 0 20px; color: #94a3b8; font-size: 13px; line-height: 1.5;">
              Enter the 6-digit verification code below on the admin sign-in screen to confirm identity:
            </p>

            <!-- OTP Display Card -->
            <div style="background: linear-gradient(180deg, #0a1120 0%, #0d1726 100%); border: 2px solid #0284c7; border-radius: 12px; padding: 22px 16px; text-align: center; margin: 24px 0;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; font-weight: 700; margin-bottom: 8px;">
                One-Time Verification Code
              </span>
              <span style="font-family: 'SF Pro Display', Consolas, Monaco, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #ffffff; display: inline-block; padding-left: 8px;">
                ${otp}
              </span>
            </div>

            <!-- Notice & Expiry -->
            <div style="background: rgba(2, 132, 199, 0.08); border-left: 3px solid #38bdf8; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
              <p style="margin: 0; color: #93c5fd; font-size: 12.5px; line-height: 1.5;">
                ⏱️ This code is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>. For security, never share this code with anyone.
              </p>
            </div>

            <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
              ⚠️ If you did not attempt to sign in to the FD MAKAN Admin Dashboard, please change your admin credentials immediately.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px 32px; background-color: #0b1320; border-top: 1px solid #1e293b; text-align: center;">
            <p style="margin: 0; color: #475569; font-size: 11.5px;">
              FD MAKAN Real Estate Portal &bull; Automated Security Delivery
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildOtpEmailText(otp: string, adminEmail: string): string {
  return [
    'FD MAKAN — Admin Two-Factor Authentication',
    '==========================================',
    '',
    `A sign-in request was initiated for administrator: ${adminEmail}`,
    '',
    `Your 6-Digit Verification Code is: ${otp}`,
    '',
    `This code is valid for ${OTP_EXPIRY_MINUTES} minutes.`,
    'If you did not request this code, please change your admin password immediately.',
    '',
    'FD MAKAN Real Estate Portal',
  ].join('\n');
}

/**
 * Deliver OTP to the authorized 2FA email (strictly aman.fdmps@gmail.com)
 */
async function sendOtpEmail(otp: string, adminEmail: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY is not configured in .env' };
  }

  const primaryFrom = process.env.RESEND_FROM_EMAIL || 'FD MAKAN Security <enquiry@fdmakan.com>';
  const fallbackFrom = 'FD MAKAN Security <onboarding@resend.dev>';
  const fromAddresses = [primaryFrom, fallbackFrom].filter((v): v is string => Boolean(v?.trim()));

  const resend = new Resend(apiKey);
  const subject = `[FD MAKAN] Admin Login Verification Code: ${otp}`;
  const html = buildOtpEmailHtml(otp, adminEmail);
  const text = buildOtpEmailText(otp, adminEmail);

  let lastError = 'Failed to send OTP email';

  for (const from of fromAddresses) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [ADMIN_2FA_TARGET_EMAIL],
        subject,
        html,
        text,
      });

      if (error) {
        lastError = error.message || JSON.stringify(error);
        console.error(`Resend error sending 2FA OTP (from: ${from}):`, error);
        continue;
      }

      console.log(`2FA OTP successfully sent to ${ADMIN_2FA_TARGET_EMAIL} (messageId: ${data?.id})`);
      return { success: true };
    } catch (err: any) {
      lastError = err?.message || 'Exception while sending OTP email';
      console.error(`Resend exception sending 2FA OTP (from: ${from}):`, err);
    }
  }

  return { success: false, error: lastError };
}

/**
 * Setup MongoDB index for OTPs collection with TTL automatic expiration
 */
let indexesCreated = false;
async function ensureOtpIndexes() {
  if (indexesCreated) return;
  try {
    const db = await getDatabase();
    const collection = db.collection('admin_otps');
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await collection.createIndex({ sessionId: 1 }, { unique: true });
    indexesCreated = true;
  } catch (err) {
    console.error('Failed to ensure admin_otps index:', err);
  }
}

/**
 * Step 1: Create a 2FA challenge and send the OTP to aman.fdmps@gmail.com
 */
export async function createTwoFactorChallenge(adminEmail: string): Promise<{
  success: boolean;
  twoFactorToken?: string;
  targetEmail: string;
  error?: string;
}> {
  try {
    const sessionId = crypto.randomUUID();
    const otp = generateOtp();
    const salt = crypto.randomBytes(16).toString('hex');
    const otpHash = hashOtp(otp, salt);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save challenge to MongoDB
    try {
      await ensureOtpIndexes();
      const db = await getDatabase();
      await db.collection('admin_otps').insertOne({
        sessionId,
        adminEmail: adminEmail.trim().toLowerCase(),
        targetEmail: ADMIN_2FA_TARGET_EMAIL,
        otpHash,
        salt,
        attempts: 0,
        maxAttempts: MAX_VERIFY_ATTEMPTS,
        consumed: false,
        createdAt: new Date(),
        lastResentAt: new Date(),
        expiresAt,
      });
    } catch (dbErr) {
      console.error('Failed to save 2FA record to MongoDB:', dbErr);
    }

    // Send the email to aman.fdmps@gmail.com
    const emailRes = await sendOtpEmail(otp, adminEmail);
    if (!emailRes.success) {
      return {
        success: false,
        targetEmail: ADMIN_2FA_TARGET_EMAIL,
        error: `Could not send verification email: ${emailRes.error}`,
      };
    }

    // Sign a temporary 2FA token
    const secretKey = getSecretKey();
    const twoFactorToken = await new SignJWT({
      sessionId,
      adminEmail: adminEmail.trim().toLowerCase(),
      targetEmail: ADMIN_2FA_TARGET_EMAIL,
      otpHash,
      salt,
      purpose: 'admin_2fa_challenge',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${OTP_EXPIRY_MINUTES}m`)
      .sign(secretKey);

    return {
      success: true,
      twoFactorToken,
      targetEmail: ADMIN_2FA_TARGET_EMAIL,
    };
  } catch (error: any) {
    console.error('Error creating 2FA challenge:', error);
    return {
      success: false,
      targetEmail: ADMIN_2FA_TARGET_EMAIL,
      error: error.message || 'Internal error creating 2FA challenge',
    };
  }
}

/**
 * Step 2: Verify the submitted OTP against the session
 */
export async function verifyTwoFactorOTP({
  twoFactorToken,
  otp,
}: {
  twoFactorToken: string;
  otp: string;
}): Promise<{
  success: boolean;
  email?: string;
  error?: string;
  remainingAttempts?: number;
}> {
  try {
    if (!twoFactorToken || !otp) {
      return { success: false, error: 'Verification code is required' };
    }

    const cleanOtp = otp.trim().replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      return { success: false, error: 'Please enter a valid 6-digit code' };
    }

    const secretKey = getSecretKey();
    let payload: any;
    try {
      const res = await jwtVerify(twoFactorToken, secretKey);
      payload = res.payload;
    } catch {
      return { success: false, error: 'Verification session expired. Please sign in again.' };
    }

    if (payload.purpose !== 'admin_2fa_challenge' || !payload.sessionId) {
      return { success: false, error: 'Invalid verification token' };
    }

    const sessionId = payload.sessionId as string;
    const adminEmail = (payload.adminEmail as string) || 'admin@fdmakan.com';

    // Check in MongoDB
    try {
      const db = await getDatabase();
      const collection = db.collection('admin_otps');
      const record = await collection.findOne({ sessionId });

      if (record) {
        if (record.consumed) {
          return { success: false, error: 'This code was already used. Please request a new one.' };
        }

        if (new Date() > record.expiresAt) {
          return { success: false, error: 'Verification code has expired. Please request a new one.' };
        }

        if (record.attempts >= record.maxAttempts) {
          return {
            success: false,
            error: 'Too many incorrect attempts. Please sign in again to receive a fresh code.',
          };
        }

        const expectedHash = record.otpHash;
        const submittedHash = hashOtp(cleanOtp, record.salt);

        if (submittedHash !== expectedHash) {
          const newAttempts = record.attempts + 1;
          const remaining = Math.max(0, record.maxAttempts - newAttempts);
          await collection.updateOne(
            { sessionId },
            { $set: { attempts: newAttempts } }
          );

          return {
            success: false,
            error: remaining > 0
              ? `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
              : 'Maximum attempts reached. Please sign in again.',
            remainingAttempts: remaining,
          };
        }

        // Successfully matched! Mark as consumed
        await collection.updateOne(
          { sessionId },
          { $set: { consumed: true, consumedAt: new Date() } }
        );

        return { success: true, email: adminEmail };
      }
    } catch (dbErr) {
      console.error('Database check failed during OTP verification, falling back to token:', dbErr);
    }

    // Fallback verification using signed token payload if MongoDB is unreachable
    const fallbackHash = hashOtp(cleanOtp, payload.salt);
    if (fallbackHash === payload.otpHash) {
      return { success: true, email: adminEmail };
    }

    return { success: false, error: 'Invalid verification code' };
  } catch (error: any) {
    console.error('Error verifying 2FA OTP:', error);
    return { success: false, error: error.message || 'Error verifying code' };
  }
}

/**
 * Resend OTP to aman.fdmps@gmail.com
 */
export async function resendTwoFactorOTP({
  twoFactorToken,
}: {
  twoFactorToken: string;
}): Promise<{
  success: boolean;
  error?: string;
  retryAfterSeconds?: number;
}> {
  try {
    if (!twoFactorToken) {
      return { success: false, error: 'Session token is missing' };
    }

    const secretKey = getSecretKey();
    let payload: any;
    try {
      const res = await jwtVerify(twoFactorToken, secretKey);
      payload = res.payload;
    } catch {
      return { success: false, error: 'Session expired. Please sign in again.' };
    }

    const sessionId = payload.sessionId as string;
    const adminEmail = (payload.adminEmail as string) || 'admin@fdmakan.com';

    let lastResentAt: Date | null = null;
    let dbCollection: any = null;

    try {
      const db = await getDatabase();
      dbCollection = db.collection('admin_otps');
      const record = await dbCollection.findOne({ sessionId });
      if (record?.lastResentAt) {
        lastResentAt = new Date(record.lastResentAt);
      }
    } catch (err) {
      console.warn('MongoDB lookup during resend:', err);
    }

    if (lastResentAt) {
      const diffMs = Date.now() - lastResentAt.getTime();
      const cooldownMs = RESEND_COOLDOWN_SECONDS * 1000;
      if (diffMs < cooldownMs) {
        const remaining = Math.ceil((cooldownMs - diffMs) / 1000);
        return {
          success: false,
          error: `Please wait ${remaining} second${remaining === 1 ? '' : 's'} before requesting another code.`,
          retryAfterSeconds: remaining,
        };
      }
    }

    const newOtp = generateOtp();
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashOtp(newOtp, newSalt);
    const newExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const emailRes = await sendOtpEmail(newOtp, adminEmail);
    if (!emailRes.success) {
      return { success: false, error: emailRes.error || 'Failed to send new verification email' };
    }

    if (dbCollection) {
      try {
        await dbCollection.updateOne(
          { sessionId },
          {
            $set: {
              otpHash: newHash,
              salt: newSalt,
              attempts: 0,
              consumed: false,
              lastResentAt: new Date(),
              expiresAt: newExpiresAt,
            },
          }
        );
      } catch (err) {
        console.error('Failed to update DB on OTP resend:', err);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error during resend OTP:', error);
    return { success: false, error: error.message || 'Internal error resending OTP' };
  }
}
