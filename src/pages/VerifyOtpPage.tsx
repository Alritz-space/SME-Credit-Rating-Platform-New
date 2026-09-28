import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_OTP } from '../utils/constants';
import { ShieldCheck, ArrowRight, RotateCw, AlertCircle, ArrowLeft } from 'lucide-react';

export const VerifyOtpPage: React.FC = () => {
  const { state, updateUser, navigate } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format mobile with spaces: +91 98765 43210
  const mobile = state.user.mobile || '9876543210';
  const formattedMobile =
    mobile.length === 10
      ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`
      : `+91 ${mobile}`;

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    setError('');
    // Handle paste
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      const focusIndex = Math.min(pastedDigits.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const cleanDigit = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    setDigits(newDigits);

    // Auto-advance
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = digits.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    if (enteredOtp !== DEMO_OTP) {
      setError('Invalid OTP. For prototype testing, please enter 123456.');
      return;
    }

    // Success
    updateUser({ isVerified: true });
    navigate('/dashboard');
  };

  const handleResend = () => {
    setDigits(['', '', '', '', '', '']);
    setError('');
    setCountdown(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const fillDemoOtp = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
    setError('');
    inputRefs.current[5]?.focus();
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 sm:p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registration</span>
          </button>

          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 border border-teal-200">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Verify your mobile number
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            We sent a six-digit OTP to{' '}
            <span className="font-semibold text-slate-900 font-mono">
              {formattedMobile}
            </span>
            .
          </p>
        </div>

        {/* Demo Helper Callout */}
        <div className="mb-6 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">Demo OTP:</span>
            <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-200 tracking-widest">
              123456
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemoOtp}
            className="text-[11px] font-semibold text-amber-800 hover:underline"
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6 Digit Inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-between gap-2">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-12 h-13 sm:w-13 sm:h-14 text-center text-xl font-mono font-bold rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all ${
                    error
                      ? 'border-red-400 focus:ring-red-200 text-red-900'
                      : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500 text-slate-900'
                  }`}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs mt-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Verify & proceed to dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Resend Link with countdown */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Resend OTP</span>
              </button>
            ) : (
              <span>
                Resend OTP in{' '}
                <span className="font-mono font-bold text-slate-800">
                  {countdown}s
                </span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
