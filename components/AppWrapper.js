'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Sidebar from "./Sidebar";

export default function AppWrapper({ children }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  
  const isAuthPage = pathname.includes('login') || pathname.includes('forgot-password');

  useEffect(() => {
    if (!isAuthPage && !token) {
      router.push('/login');
    }
  }, [isAuthPage, token, router]);

  if (isAuthPage) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  if (!token) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen">
        <div className="w-full">
          {children}
        </div>
      </main>
    </>
  );
}
