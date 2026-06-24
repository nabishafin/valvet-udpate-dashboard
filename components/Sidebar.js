'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Users,
  Tag,
  LogOut,
  Loader2,
  Zap,
  BookOpen,
  Mail,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../app/redux/slices/authSlice';
import { useLogoutMutation } from '../app/redux/features/auth/authApi';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API fails, clear local session
    } finally {
      // Clear tokens from storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // Clear Redux state
      dispatch(logout());
      toast.success('Logged out successfully.');
      router.push('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Instant Bookings', icon: Zap, path: '/instant-bookings' },
    { name: 'Contact Messages', icon: MessageSquare, path: '/contact' },
    { name: 'Manage Services', icon: Settings, path: '/services' },
    { name: 'Manage Team', icon: Users, path: '/team' },
    { name: 'Blog', icon: BookOpen, path: '/blogs' },
    { name: 'Subscribers', icon: Mail, path: '/subscribers' },
    { name: 'Investment Plans', icon: Tag, path: '/pricing' },
    { name: 'Global Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-maroon flex flex-col z-50 shadow-2xl">
      <div className="p-6 pt-10">
        <div className="flex items-center justify-center bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/10">
          <div className="relative w-32 h-16 overflow-hidden">
            <Image
              src="/valvet.png"
              alt="Velvet Logo"
              fill
              sizes="128px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                      ? 'bg-gold text-white shadow-lg shadow-gold/30 scale-[1.02]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-white/40 group-hover:text-white'} />
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-white/70 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
        >
          {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
          <span className="font-semibold text-sm tracking-wide">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
