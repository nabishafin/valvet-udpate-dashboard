'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "./Sidebar";

export default function AppWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/forgot-password';

  if (isAuthPage) {
    return <main className="w-full">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen overflow-x-hidden">
        <div className="w-full">
          {children}
        </div>
      </main>
    </>
  );
}
