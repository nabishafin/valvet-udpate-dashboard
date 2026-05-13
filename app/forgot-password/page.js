'use client';

import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleReset = (e) => {
    e.preventDefault();
    // Simulate password reset
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-zebra flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-maroon/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] bg-gold/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-[550px] bg-white rounded-3xl shadow-2xl shadow-maroon/5 border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-10 lg:p-14">
          <div className="flex items-center justify-between mb-10">
            <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-maroon transition-colors group w-fit">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </Link>
            <div className="relative w-24 h-8">
              <Image 
                src="/valvet.png" 
                alt="Velvet Rouge Logo" 
                fill
                className="object-contain" 
              />
            </div>
          </div>

          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-maroon/5 rounded-2xl flex items-center justify-center text-maroon mx-auto mb-6">
              {step === 1 && <Mail size={32} />}
              {step === 2 && <KeyRound size={32} />}
              {step === 3 && <ShieldCheck size={32} />}
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              {step === 1 && 'Forgot Password?'}
              {step === 2 && 'Verification Code'}
              {step === 3 && 'New Password'}
            </h2>
            <p className="text-zinc-500 mt-2 font-medium">
              {step === 1 && "No worries! Enter your email and we'll send a code."}
              {step === 2 && `We've sent a 6-digit code to ${email || 'your email'}.`}
              {step === 3 && 'Set a strong password for your admin account.'}
            </p>
          </div>

          <form onSubmit={step === 3 ? handleReset : handleNextStep} className="space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@velvetrouge.com"
                    className="w-full pl-14 pr-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-semibold placeholder:text-zinc-300"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">6-Digit Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    required
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    className="w-full pl-14 pr-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-black tracking-[0.5em] text-center placeholder:text-zinc-200"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-semibold placeholder:text-zinc-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-14 pr-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-semibold placeholder:text-zinc-300"
                    />
                  </div>
                </div>
              </>
            )}

            <button className="w-full bg-maroon text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-maroon/20 hover:bg-maroon/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group">
              <span>
                {step === 1 && 'Send Code'}
                {step === 2 && 'Verify Code'}
                {step === 3 && 'Reset Password'}
              </span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {step === 2 && (
            <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
              Didn&apos;t receive the code? 
              <button className="text-maroon font-bold ml-2 hover:underline">Resend</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
