'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}