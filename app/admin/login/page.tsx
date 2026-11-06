'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type AuthStep = 'credentials' | 'two_factor';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  // Step state
  const [step, setStep] = useState<AuthStep>('credentials');

  // Step 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: 2FA
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [targetEmail, setTargetEmail] = useState('aman.fdmps@gmail.com');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Resend cooldown timer
  const [countdown, setCountdown] = useState(0);

  // Decrement countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus the first OTP box when entering 2FA step
  useEffect(() => {
    if (step === 'two_factor') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      if (data.requires2FA) {
        setTwoFactorToken(data.twoFactorToken);
        setTargetEmail(data.targetEmail || 'aman.fdmps@gmail.com');
        setOtpDigits(['', '', '', '', '', '']);
        setStep('two_factor');
        setCountdown(45); // 45 seconds cooldown before allowing resend
        setSuccessMsg(data.message || `Verification code sent to ${data.targetEmail}`);
      } else {
        // Fallback in case direct login occurred
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only accept numeric
    const cleanVal = value.replace(/\D/g, '');

    // If pasted multiple digits
    if (cleanVal.length > 1) {
      handlePastedOtp(cleanVal);
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setError('');

    // Auto advance to next box
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-verify
    if (cleanVal && index === 5 && newDigits.every((d) => d !== '')) {
      const fullOtp = newDigits.join('');
      executeVerifyOtp(fullOtp);
    }
  };

  // Handle backspace navigation between boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle pasting full OTP
  const handlePastedOtp = (pasted: string) => {
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, 6);
    if (!digitsOnly) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < digitsOnly.length; i++) {
      newDigits[i] = digitsOnly[i];
    }
    setOtpDigits(newDigits);
    setError('');

    const targetFocus = Math.min(digitsOnly.length, 5);
    otpInputRefs.current[targetFocus]?.focus();

    if (digitsOnly.length === 6) {
      executeVerifyOtp(digitsOnly);
    }
  };

  // Execute OTP verification
  const executeVerifyOtp = async (codeToVerify?: string) => {
    const otp = codeToVerify || otpDigits.join('');
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twoFactorToken,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setSuccessMsg('Verification successful! Access granted.');
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      // Clear inputs on failure so user can retype quickly
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    setError('');
    setSuccessMsg('');
    setIsResending(true);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twoFactorToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setSuccessMsg(`A fresh 6-digit code has been sent to ${targetEmail}`);
      setCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Unable to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  // Back to credentials
  const handleBackToLogin = () => {
    setStep('credentials');
    setError('');
    setSuccessMsg('');
    setTwoFactorToken('');
    setOtpDigits(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white">
      {/* Brand & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-4 transition transform hover:scale-105 duration-200">
          <Image
            src="/fd_makan_logo-removebg-preview.png"
            alt="FD MAKAN Logo"
            width={180}
            height={60}
            className="h-12 w-auto object-contain mx-auto"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          Admin Portal
          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
            Protected
          </span>
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {step === 'credentials'
            ? 'Sign in to access the management dashboard'
            : 'Two-factor security verification required'}
        </p>
      </div>

      {/* Main Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-black/60 rounded-2xl border border-slate-800/80 sm:px-10 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Feedback Banners */}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-sm text-rose-300 flex items-start space-x-2.5 animate-fadeIn">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {successMsg && !error && (
            <div className="mb-6 rounded-xl bg-teal-500/10 border border-teal-500/30 p-3.5 text-sm text-teal-300 flex items-start space-x-2.5 animate-fadeIn">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* STEP 1: CREDENTIALS */}
          {step === 'credentials' && (
            <form className="space-y-5" onSubmit={handleCredentialsSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fdmakan.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-950/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Validating credentials & sending OTP...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In & Request 2FA OTP
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-teal-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Protected by 2-Factor Authentication via security email
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: 2FA OTP VERIFICATION */}
          {step === 'two_factor' && (
            <div className="space-y-6">
              {/* Security Shield Icon Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 shadow-inner shadow-teal-500/10">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Enter 6-Digit Code</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  The security code has been sent exclusively to:
                  <span className="block mt-1 font-mono font-semibold text-teal-300 bg-teal-950/60 py-1 px-2.5 rounded-lg border border-teal-800/60">
                    {targetEmail}
                  </span>
                </p>
              </div>

              {/* 6-Digit Boxes */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      handlePastedOtp(e.clipboardData.getData('text'));
                    }}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-slate-950/90 border transition-all duration-150 focus:outline-none ${
                      digit
                        ? 'border-teal-400 text-teal-200 ring-2 ring-teal-500/30 bg-teal-950/20'
                        : 'border-slate-700 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => executeVerifyOtp()}
                  disabled={isLoading || otpDigits.some((d) => d === '')}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-950/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Verifying code...
                    </span>
                  ) : (
                    'Verify & Enter Dashboard'
                  )}
                </button>

                {/* Resend and Switch Account Controls */}
                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending}
                    className="font-medium text-teal-400 hover:text-teal-300 disabled:text-slate-500 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    {isResending
                      ? 'Sending fresh code...'
                      : countdown > 0
                      ? `Resend code in ${countdown}s`
                      : 'Resend code'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Use different account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
