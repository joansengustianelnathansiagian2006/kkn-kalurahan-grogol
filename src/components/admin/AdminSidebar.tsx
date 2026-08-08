'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Profil Website', href: '/admin/profil-website', icon: 'settings_accessibility' },
  { name: 'Program Kerja', href: '/admin/program-kerja', icon: 'assignment' },
  { name: 'Artikel', href: '/admin/artikel', icon: 'newspaper' },
  { name: 'UMKM', href: '/admin/umkm', icon: 'store' },
  { name: 'Potensi Desa', href: '/admin/potensi-desa', icon: 'landscape' },
  { name: 'Galeri', href: '/admin/galeri', icon: 'photo_library' },
  { name: 'Download Center', href: '/admin/download-center', icon: 'download' },
  { name: 'Tim KKN', href: '/admin/tim-kkn', icon: 'group' },
  { name: 'Pengaturan', href: '/admin/setting', icon: 'settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/admin/login',
    });
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col p-4 border-r border-slate-800">
      {/* Header Sidebar */}
      <div className="px-4 py-3 mb-4">
        <h2 className="text-lg font-bold text-white tracking-wide">Admin Panel</h2>
        <p className="text-xs text-emerald-400">Kalurahan Grogol</p>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Tombol Logout (Di bagian paling bawah) */}
      <div className="pt-4 border-t border-slate-800 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Keluar
        </button>
      </div>
    </aside>
  );
}