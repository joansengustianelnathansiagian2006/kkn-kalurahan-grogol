// src/components/public/Navbar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  {
    name: 'Profil',
    href: '/profil',
    submenu: [
      { name: 'Sejarah', href: '/profil#sejarah' },
      { name: 'Visi & Misi', href: '/profil#visi-misi' },
      { name: 'Struktur Pemerintahan', href: '/profil#struktur' },
      { name: 'Kondisi Geografis', href: '/profil#geografis' },
      { name: 'Demografi', href: '/profil#demografi' },
      { name: 'Peta Wilayah', href: '/profil#peta' },
      { name: 'Padukuhan', href: '/profil#padukuhan' },
      { name: 'Fasilitas Umum', href: '/profil#fasilitas' },
    ],
  },
  {
    name: 'Jelajah Desa',
    href: '/program-kerja',
    submenu: [
      { name: 'Program Kerja', href: '/program-kerja' },
      { name: 'UMKM', href: '/umkm' },
      { name: 'Potensi Desa', href: '/potensi-desa' },
    ],
  },
  {
    name: 'Berita & Galeri',
    href: '/berita',
    submenu: [
      { name: 'Berita Desa', href: '/berita' },
      { name: 'Galeri Dokumentasi', href: '/galeri' },
    ],
  },
  { name: 'Download Center', href: '/download-center' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

  const activeIndex = NAV_ITEMS.findIndex((item) => {
    if (item.href === '/') return pathname === '/';
    if (item.submenu) {
      return item.submenu.some((sub) => pathname.startsWith(sub.href.split('#')[0]));
    }
    return pathname.startsWith(item.href);
  });

  const currentIndex = hoverIndex !== null ? hoverIndex : (activeIndex !== -1 ? activeIndex : 0);

  useEffect(() => {
    const target = itemRefs.current[currentIndex];
    const navContainer = navRef.current;
    if (target && navContainer) {
      const targetRect = target.getBoundingClientRect();
      const navRect = navContainer.getBoundingClientRect();
      setPillStyle({
        left: targetRect.left - navRect.left,
        width: targetRect.width,
        opacity: 1,
      });
    }
  }, [currentIndex, pathname]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-7xl flex flex-col items-center">
        
        {/* BAR UTAMA */}
        <div className="w-full flex items-center justify-between px-5 py-2.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 shadow-2xl">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              G
            </div>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-white leading-tight text-sm sm:text-base">
                Kalurahan Grogol
              </h1>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Sobat Desa
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            ref={navRef}
            className="hidden md:flex relative items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-white/20"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div
              style={{
                transform: `translateX(${pillStyle.left}px)`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
              className="absolute top-1 bottom-1 left-0 rounded-full bg-white/70 dark:bg-emerald-500/30 backdrop-blur-md border border-white/80 dark:border-emerald-400/40 shadow-md transition-all duration-300 ease-out pointer-events-none"
            />

            {NAV_ITEMS.map((item, index) => {
              if (item.submenu) {
                return (
                  <div
                    key={item.name}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    className="relative group"
                    onMouseEnter={() => setHoverIndex(index)}
                  >
                    <Link
                      href={item.href}
                      className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
                        currentIndex === index
                          ? 'text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700'
                      }`}
                    >
                      {item.name}
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* DROPDOWN MENU */}
                    <div className="absolute top-full left-0 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 w-56">
                      <div className="p-2 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl flex flex-col gap-1">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  ref={(el) => { itemRefs.current[index] = el; }}
                  onMouseEnter={() => setHoverIndex(index)}
                  className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                    currentIndex === index
                      ? 'text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* HAMBURGER MOBILE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-800 dark:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden w-full mt-2 p-3 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl flex flex-col gap-1 max-h-[75vh] overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              if (item.submenu) {
                const isSubmenuOpen = openSubmenu === item.name;
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.name)}
                      className="px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between text-white"
                    >
                      <span>{item.name}</span>
                      <svg className={`w-4 h-4 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isSubmenuOpen && (
                      <div className="ml-4 pl-3 border-l-2 border-emerald-500/40 flex flex-col gap-1 my-1">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-emerald-400"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}