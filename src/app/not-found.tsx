'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full relative overflow-hidden min-h-[80vh] flex items-center justify-center py-12 px-4">
      {/* SVG Liquid Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquid-melt">
            <feTurbulence
              baseFrequency="0.015 0.05"
              numOctaves={3}
              result="warp"
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warp"
              scale={30}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Ambient Background Blur Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-emerald-700/30 dark:bg-emerald-900/40 rounded-full mix-blend-multiply filter blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-500/20 dark:bg-emerald-950/50 rounded-full mix-blend-multiply filter blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[30%] left-[60%] w-[25vw] h-[25vw] bg-emerald-800/20 rounded-full mix-blend-multiply filter blur-[80px] animate-[pulse_6s_ease-in-out_infinite_1s]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Distorted 404 Visual */}
        <div className="relative w-full h-48 md:h-72 flex items-center justify-center mb-6">
          <h1
            className="font-black text-[120px] md:text-[200px] leading-none text-emerald-800 dark:text-emerald-500 tracking-tighter select-none opacity-90"
            style={{ filter: 'url(#liquid-melt)', transform: 'translateZ(0)' }}
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="font-black text-[120px] md:text-[200px] leading-none text-emerald-600/10 dark:text-emerald-400/10 tracking-tighter blur-md select-none">
              404
            </h1>
          </div>
        </div>

        {/* Glassmorphic Content Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 md:p-14 rounded-3xl shadow-[0_8px_32px_rgba(0,73,0,0.06)] border border-white/50 dark:border-slate-800 w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.01]">
          <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-400 text-[52px] mb-4 inline-block">
            explore_off
          </span>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Mari kembali ke jalur yang benar.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto mb-8 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari informasi atau layanan..."
              className="w-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_4px_20px_rgba(0,73,0,0.08)] transition-all duration-300 placeholder:text-slate-400"
            />
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="relative overflow-hidden group bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-7 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              <span>Kembali ke Beranda</span>
            </Link>

            <Link
              href="/kontak"
              className="font-semibold text-emerald-800 dark:text-emerald-400 px-7 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 w-full sm:w-auto border border-emerald-800/20 dark:border-emerald-400/20"
            >
              Hubungi Bantuan
            </Link>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="mt-12 text-center">
          <span className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            ERROR CODE: 404 // KALURAHAN GROGOL
          </span>
        </div>

      </div>
    </div>
  );
}