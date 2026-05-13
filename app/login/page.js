'use client';

import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth logic
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-zebra flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-maroon/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] bg-gold/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl shadow-maroon/5 border border-zinc-100 overflow-hidden flex min-h-[700px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Brand Experience */}
        <div className="hidden lg:flex w-1/2 bg-maroon relative overflow-hidden p-16 flex-col justify-between">
          {/* Abstract Texture Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-maroon font-black text-xl">V</span>
              </div>
              <span className="text-white font-black uppercase tracking-[0.3em] text-sm">Velvet Rouge</span>
            </div>
            
            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Admin <br />
              <span className="text-white/40">Operating System</span>
            </h1>
            <p className="text-white/60 mt-6 max-w-sm text-lg font-medium leading-relaxed">
              Precision management for the world&apos;s most exclusive beauty and grooming collectives.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold uppercase tracking-widest">Enterprise Security</p>
                <p className="text-white/40 text-[10px]">256-bit Encrypted Management</p>
              </div>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[40px] border-white/5 rounded-full" />
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-zinc-500 mt-2 font-medium">
              {isLogin ? 'Enter your credentials to access the OS.' : 'Join the Velvet Rouge collective today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Elena Vossen"
                    className="w-full pl-14 pr-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-semibold placeholder:text-zinc-300"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@velvetrouge.com"
                  className="w-full pl-14 pr-6 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-semibold placeholder:text-zinc-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Password</label>
                <Link 
                  href="/forgot-password"
                  className="text-[10px] font-bold text-maroon uppercase tracking-widest hover:underline focus:outline-none"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 bg-zebra border-none rounded-xl focus:ring-2 focus:ring-maroon/20 transition-all text-zinc-900 font-semibold placeholder:text-zinc-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-maroon text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-maroon/20 hover:bg-maroon/90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 group">
              <span>{isLogin ? 'Sign In to Dashboard' : 'Create Admin Profile'}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
            <p className="text-zinc-500 text-sm font-medium">
              {isLogin ? "Don't have an account yet?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-maroon font-bold ml-2 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest hover:text-zinc-600 cursor-pointer transition-colors">Privacy Policy</span>
              <div className="w-1 h-1 bg-zinc-200 rounded-full" />
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest hover:text-zinc-600 cursor-pointer transition-colors">Help Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
