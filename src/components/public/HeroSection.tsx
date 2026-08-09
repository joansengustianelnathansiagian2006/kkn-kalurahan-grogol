'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroStats {
  penduduk: string | number;
  luasWilayah: string | number;
  totalUmkm: number;
  totalProja: number;
}

interface HeroSectionProps {
  stats?: HeroStats;
}

function Counter({ value }: { value: string | number }) {
  const strVal = String(value ?? '0').trim();
  const isK = strVal.toUpperCase().endsWith('K');
  const numericTarget = isK
    ? parseFloat(strVal.replace(/[^0-9.]/g, '')) * 1000
    : parseFloat(strVal.replace(/[^0-9.]/g, '')) || 0;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!numericTarget) return;

    const duration = 1500;
    const frameTime = 1000 / 60;
    const totalFrames = Math.round(duration / frameTime);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.floor(numericTarget * (1 - Math.pow(2, -10 * progress)));

      if (frame >= totalFrames) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, frameTime);

    return () => clearInterval(timer);
  }, [numericTarget]);

  if (isK || count >= 1000) {
    return <>{(count / 1000).toFixed(1)}K</>;
  }

  return <>{count.toLocaleString()}</>;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const penduduk = stats?.penduduk ?? '4.2K';
  const luasWilayah = stats?.luasWilayah ?? '350';
  const totalUmkm = stats?.totalUmkm ?? 84;
  const totalProja = stats?.totalProja ?? 12;

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-[819px] min-h-[600px] flex items-end pb-24 lg:pb-32 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-grogol.jpg')",
        }}
      >
        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent mix-blend-multiply pointer-events-none" />

        <div className="relative z-10 max-w-container-max mx-auto w-full px-margin-desktop flex flex-col items-start">
          <span className="inline-block px-4 py-1.5 mb-6 bg-primary/20 backdrop-blur-md rounded-full font-label-caps text-label-caps text-on-primary-container uppercase tracking-widest shadow-lg">
            Selamat Datang di
          </span>
          <h1 className="font-display-xl text-display-xl text-surface mb-6 max-w-3xl leading-tight">
            Harmoni Tradisi &amp; <br />
            Inovasi Digital
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant max-w-2xl mb-10 opacity-90">
            Sistem Informasi Desa Digital Kalurahan Grogol, Kapanewon Paliyan, Kabupaten Gunungkidul. Membangun masa depan yang berkelanjutan berlandaskan kearifan lokal, memajukan ekonomi desa melalui transparansi dan kolaborasi.
          </p>
          <div className="flex gap-4">
            <Link
              href="/program-kerja"
              className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 px-8 py-4 rounded-full font-body-bold text-body-bold shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Jelajahi Desa
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Overlay */}
      <div className="relative z-20 max-w-container-max mx-auto w-full px-margin-desktop -mt-16 mb-section-gap-sm">
        <div className="bg-surface/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <span className="font-display-lg text-display-lg text-primary mb-2">
              <Counter value={penduduk} />
            </span>
            <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
              Penduduk
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-display-lg text-display-lg text-primary mb-2">
              <Counter value={luasWilayah} />
            </span>
            <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
              Hektar Luas Wilayah
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-display-lg text-display-lg text-primary mb-2">
              <Counter value={totalUmkm} />
            </span>
            <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
              UMKM Aktif
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-display-lg text-display-lg text-primary mb-2">
              <Counter value={totalProja} />
            </span>
            <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
              Program Unggulan
            </span>
          </div>
        </div>
      </div>
    </>
  );
}