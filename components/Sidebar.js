'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  MessageSquare, 
  LogOut,
  Palette
} from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Perform any cleanup here if needed
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Manage Services', icon: Settings, path: '/services' },
    { name: 'Manage Team', icon: Users, path: '/team' },
    { name: 'Inquiries', icon: MessageSquare, path: '/inquiries' },
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
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
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
          className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
