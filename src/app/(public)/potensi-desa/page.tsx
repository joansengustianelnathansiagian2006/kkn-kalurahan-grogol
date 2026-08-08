'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Potensi {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

const CATEGORIES = [
  'Semua',
  'Pertanian',
  'Peternakan',
  'Wisata',
  'Budaya',
  'Kerajinan',
  'Sumber Daya Alam',
  'Potensi lainnya',
];

export default function PotensiDesaPage() {
  const [potensiList, setPotensiList] = useState<Potensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPotensi();
  }, []);

  const fetchPotensi = async () => {
    const { data, error } = await supabase
      .from('potensi_desa')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      const formattedData: Potensi[] = data.map((item) => ({
        id: String(item.id),
        slug: item.slug || String(item.id),
        title: item.title || item.judul || '',
        category: item.category || item.kategori || 'Potensi lainnya',
        description: item.description || item.deskripsi || '',
        image: item.image || item.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800',
      }));
      setPotensiList(formattedData);
    }
    setLoading(false);
  };

  // Filter Data Potensi
  const filtered = potensiList.filter((item) => {
    const matchSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === 'Semua' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  // Reset activeIndex pencarian / filter berubah
  useEffect(() => {
    setActiveIndex(0);
  }, [search, selectedCategory]);

  // Transisi GSAP
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

  // GSAP matchMedia (min-width: 1024px)
  useEffect(() => {
    if (loading || filtered.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

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
      mm.revert();
    };
  }, [loading, filtered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Memuat Potensi Desa...</p>
      </div>
    );
  }

  const activeItem = filtered[activeIndex] || filtered[0];

  return (
    <div className="bg-slate-950 text-white font-sans relative pt-20">
      
      {/* Floating Header & Search Filter Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900/80 py-4 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Kekayaan Desa
            </span>
            <h1 className="text-lg md:text-xl font-black uppercase text-white">
              Potensi Kalurahan Grogol
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari potensi atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Potensi Tidak Ditemukan</h2>
          <p className="text-slate-400 text-sm">Coba kata kunci atau kategori lainnya.</p>
        </div>
      ) : (
        <>

          {/* TAMPILAN KHUSUS HP / MOBILE (lg:hidden) */}
          <div className="block lg:hidden pt-28 px-4 pb-16 space-y-6">
            {filtered.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    #{String(index + 1).padStart(2, '0')} • {item.category}
                  </span>
                </div>

                {/* Content Info */}
                <div className="p-5 space-y-4">
                  <h2 className="text-xl font-extrabold uppercase text-white leading-tight">
                    {item.title}
                  </h2>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  <Link
                    href={`/potensi-desa/${item.slug || item.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-white text-slate-950 font-bold text-xs uppercase py-3 rounded-xl hover:bg-emerald-400 transition-colors"
                  >
                    <span>Lihat Detail Potensi</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP (hidden lg:flex) - Overlapping    */}
          <div className="hidden lg:flex flex-row pt-12">
            
            {/* SISI KIRI: Stacking Cards */}
            <div className="w-1/2 relative">
              {filtered.map((item, index) => (
                <div
                  key={item.id}
                  className="left-card sticky top-0 h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950/60 via-slate-950 to-emerald-900/40 border-r border-emerald-800/30 shadow-2xl overflow-hidden"
                  style={{ zIndex: index + 1 }}
                >
                  {/* Background Parallax */}
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 mix-blend-luminosity scale-105"
                    style={{
                      backgroundImage: `url('${item.image}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/30 to-slate-950/80" />

                  {/* Header Informasi Nomor Potensi */}
                  <div className="relative z-10 text-center select-none mb-6">
                    <span className="inline-block px-5 py-2 rounded-full text-sm font-extrabold uppercase tracking-[0.25em] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-lg backdrop-blur-md mb-3">
                      [{item.category}]
                    </span>
                    <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-900/30 leading-none">
                      POTENSI #{String(index + 1).padStart(2, '0')}
                    </h1>
                  </div>

                  {/* Preview Frame Foto Potensi */}
                  <div className="relative z-10 w-full max-w-md h-[45vh] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/90 shadow-2xl">
                    <img
                      src={item.image}
                      alt={item.title}
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
                      {activeItem.category}
                    </span>
                  </div>

                  {/* Judul Potensi */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase leading-tight">
                    {activeItem.title}
                  </h2>

                  {/* Deskripsi */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm line-clamp-6">
                    {activeItem.description || 'Belum ada deskripsi untuk potensi ini.'}
                  </p>

                  {/* Tombol Detail */}
                  <div className="pt-6 border-t border-slate-900">
                    <Link
                      href={`/potensi-desa/${activeItem.slug || activeItem.id}`}
                      className="group inline-flex items-center justify-center gap-3 bg-white text-slate-950 hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                    >
                      <span>LIHAT DETAIL POTENSI</span>
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