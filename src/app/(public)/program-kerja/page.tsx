'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProkerItem {
  id: string;
  slug?: string;
  nama: string;
  kategori: string;
  tanggal: string;
  lokasi: string;
  cover_url: string;
}

export default function ProkerPage() {
  const [prokerList, setProkerList] = useState<ProkerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProker();
  }, []);

  const fetchProker = async () => {
    const { data, error } = await supabase
      .from('proker')
      .select('id, slug, nama, kategori, tanggal, lokasi, cover_url')
      .order('created_at', { ascending: false });

    if (!error && data) setProkerList(data);
    setLoading(false);
  };

  // Filter Data Program Kerja
  const kategoriOptions = ['Semua', ...Array.from(new Set(prokerList.map((item) => item.kategori)))];

  const filteredProker = prokerList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchKategori = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  // Reset activeIndex
  useEffect(() => {
    setActiveIndex(0);
  }, [search, selectedKategori]);

  // Animasi Velocity GSAP saat activeIndex
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 35 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }
  }, [activeIndex]);

  // 2. GSAP matchMedia(min-width: 1024px)
  useEffect(() => {
    if (loading || filteredProker.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

    // Jalankan GSAP ScrollTrigger khusus layar desktop
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>('.left-card');

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 30%',
          onEnter: () => setActiveIndex(index),
          onLeaveBack: () => setActiveIndex(Math.max(0, index - 1)),
        });
      });
    });

    return () => {
      mm.revert(); // Cleanup GSAP matchMedia & triggers
    };
  }, [loading, filteredProker]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Memuat Program Kerja...</p>
      </div>
    );
  }

  const activeItem = filteredProker[activeIndex] || filteredProker[0];

  return (
    <div className="bg-slate-950 text-white font-sans relative pt-20">
      
      {/* Floating Header & Search Filter Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900/80 py-4 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Aktivitas & Inovasi
            </span>
            <h1 className="text-lg md:text-xl font-black uppercase text-white">
              Program Kerja Desa
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari program atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />

            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {kategoriOptions.map((kat, idx) => (
                <option key={idx} value={kat}>{kat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProker.length === 0 ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Program Kerja Tidak Ditemukan</h2>
          <p className="text-slate-400 text-sm">Coba kata kunci atau filter kategori lainnya.</p>
        </div>
      ) : (
        <>
          {/* TAMPILAN KHUSUS HP / MOBILE (lg:hidden) */}
          <div className="block lg:hidden pt-28 px-4 pb-16 space-y-6">
            {filteredProker.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.cover_url || '/placeholder.png'}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    #{String(index + 1).padStart(2, '0')} • {item.kategori}
                  </span>
                </div>

                {/* Content Info */}
                <div className="p-5 space-y-4">
                  <h2 className="text-xl font-extrabold uppercase text-white leading-tight">
                    {item.nama}
                  </h2>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">📅 Tanggal:</span> {item.tanggal || 'TBA'}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">📍 Lokasi:</span> {item.lokasi || 'Desa'}
                    </p>
                  </div>

                  <Link
                    href={item.slug ? `/program-kerja/${item.slug}` : `/program-kerja/${item.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-white text-slate-950 font-bold text-xs uppercase py-3 rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    <span>Lihat Detail Program</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP (hidden lg:flex) - Overlapping */}
          <div className="hidden lg:flex flex-row pt-12">
            
            {/* SISI KIRI */}
            <div className="w-1/2 relative">
              {filteredProker.map((item, index) => (
                <div
                  key={item.id}
                  className="left-card sticky top-0 h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900/60 border-r border-emerald-800/30 shadow-2xl overflow-hidden"
                  style={{ zIndex: index + 1 }}
                >
                  {/* Background Parallax */}
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25 mix-blend-luminosity scale-105"
                    style={{
                      backgroundImage: `url('${item.cover_url || '/placeholder.png'}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/40 to-slate-950/80" />

                  {/* Header Informasi Nomor Program */}
                  <div className="relative z-10 text-center select-none mb-6">
                    <span className="inline-block px-5 py-2 rounded-full text-sm font-extrabold uppercase tracking-[0.25em] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-lg backdrop-blur-md mb-3">
                      [{item.kategori}]
                    </span>
                    <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-900/30 leading-none">
                      PROGRAM #{String(index + 1).padStart(2, '0')}
                    </h1>
                  </div>

                  {/* Preview Frame Foto Program */}
                  <div className="relative z-10 w-full max-w-md h-[45vh] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/90 shadow-2xl">
                    <img
                      src={item.cover_url || '/placeholder.png'}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* SISI KANAN */}
            <div className="w-1/2 h-screen sticky top-0 flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-slate-950 z-30 border-l border-slate-900/80">
              {activeItem && (
                <div ref={contentRef} className="max-w-xl">
                  
                  {/* Kategori Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {activeItem.kategori}
                    </span>
                  </div>

                  {/* Nama Program */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase leading-tight">
                    {activeItem.nama}
                  </h2>

                  {/* Metadata Tanggal & Lokasi */}
                  <div className="space-y-3 mb-8 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="text-emerald-400 font-bold">📅 Pelaksanaan:</span>
                      <span>{activeItem.tanggal || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="text-emerald-400 font-bold">📍 Lokasi:</span>
                      <span>{activeItem.lokasi || 'Desa'}</span>
                    </div>
                  </div>

                  {/* Tombol Detail */}
                  <div className="pt-6 border-t border-slate-900">
                    <Link
                      href={activeItem.slug ? `/program-kerja/${activeItem.slug}` : `/program-kerja/${activeItem.id}`}
                      className="group inline-flex items-center justify-center gap-3 bg-white text-slate-950 hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                    >
                      <span>LIHAT DETAIL PROGRAM</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>

                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}