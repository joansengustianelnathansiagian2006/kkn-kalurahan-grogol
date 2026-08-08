'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UMKMItem {
  id: string;
  nama: string;
  dusun: string;
  kategori: string;
  whatsapp?: string;
  deskripsi: string;
  foto_url: string;
}

export default function UmkmPage() {
  const [dataUmkm, setDataUmkm] = useState<UMKMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUMKM();
  }, []);

  const fetchUMKM = async () => {
    const { data, error } = await supabase
      .from('umkm')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDataUmkm(data);
    }
    setLoading(false);
  };

  // Format nomor WhatsApp (08xxx -> 628xxx)
  const formatWA = (phone?: string) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  };

  // Filter Data UMKM
  const kategoriOptions = [
    'Semua',
    ...Array.from(new Set(dataUmkm.map((item) => item.kategori).filter(Boolean))),
  ];

  const filtered = dataUmkm.filter((item) => {
    const matchSearch =
      (item.nama || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.kategori || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.dusun || '').toLowerCase().includes(search.toLowerCase());
    const matchKategori = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  // Reset activeIndex 
  useEffect(() => {
    setActiveIndex(0);
  }, [search, selectedKategori]);

  // Transisi Panel Kanan (Desktop)
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

  // GSAP ScrollTrigger Stacking Cards
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
        <p className="animate-pulse">Memuat Direktori UMKM...</p>
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
              Perekonomian Desa
            </span>
            <h1 className="text-lg md:text-xl font-black uppercase text-white">
              Direktori UMKM Grogol
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari UMKM, produk, atau dusun..."
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

      {filtered.length === 0 ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">UMKM Tidak Ditemukan</h2>
          <p className="text-slate-400 text-sm">Coba kata kunci atau filter kategori lainnya.</p>
        </div>
      ) : (
        <>
          {/* TAMPILAN KHUSUS HP / MOBILE (lg:hidden) */}
          <div className="block lg:hidden pt-28 px-4 pb-16 space-y-6">
            {filtered.map((item, index) => {
              const formattedPhone = formatWA(item.whatsapp);
              const waLink = formattedPhone
                ? `https://wa.me/${formattedPhone}?text=Halo%20${encodeURIComponent(item.nama)},%20saya%20tertarik%20dengan%20produk%20Anda.`
                : '#';

              return (
                <div 
                  key={item.id} 
                  className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                        Tidak ada foto
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                      #{String(index + 1).padStart(2, '0')} • {item.kategori}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <h2 className="text-xl font-extrabold uppercase text-white leading-tight">
                      {item.nama}
                    </h2>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                      <p className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">📍 Dusun:</span> {item.dusun || 'Kalurahan Grogol'}
                      </p>
                    </div>

                    {item.whatsapp ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase py-3 rounded-xl transition-colors shadow-lg shadow-emerald-950/50"
                      >
                        <span>Hubungi WhatsApp</span>
                        <span className="material-symbols-outlined text-sm">chat</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-slate-800 text-slate-500 font-bold text-xs uppercase py-3 rounded-xl cursor-not-allowed"
                      >
                        WhatsApp Tidak Tersedia
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP (hidden lg:flex) - Overlapping */}
          <div className="hidden lg:flex flex-row pt-12">
            
            {/* SISI KIRI */}
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
                      backgroundImage: `url('${item.foto_url || '/placeholder.png'}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/30 to-slate-950/80" />

                  {/* Header Informasi Nomor UMKM */}
                  <div className="relative z-10 text-center select-none mb-6">
                    <span className="inline-block px-5 py-2 rounded-full text-sm font-extrabold uppercase tracking-[0.25em] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 shadow-lg backdrop-blur-md mb-3">
                      [{item.kategori}]
                    </span>
                    <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-900/30 leading-none">
                      UMKM #{String(index + 1).padStart(2, '0')}
                    </h1>
                  </div>

                  {/* Preview Frame Foto Produk/Usaha */}
                  <div className="relative z-10 w-full max-w-md h-[45vh] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/90 shadow-2xl flex items-center justify-center">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Foto Tidak Tersedia</span>
                    )}
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

                  {/* Nama UMKM */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase leading-tight">
                    {activeItem.nama}
                  </h2>

                  {/* Deskripsi */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {activeItem.deskripsi || 'Tidak ada deskripsi usaha.'}
                  </p>

                  {/* Metadata Lokasi Dusun */}
                  <div className="space-y-3 mb-8 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="text-emerald-400 font-bold">📍 Lokasi / Dusun:</span>
                      <span>{activeItem.dusun || 'Kalurahan Grogol'}</span>
                    </div>
                  </div>

                  {/* Tombol WhatsApp */}
                  <div className="pt-6 border-t border-slate-900">
                    {activeItem.whatsapp ? (
                      <a
                        href={`https://wa.me/${formatWA(activeItem.whatsapp)}?text=Halo%20${encodeURIComponent(activeItem.nama)},%20saya%20tertarik%20dengan%20produk%20Anda.`}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-xl shadow-emerald-950/50 active:scale-95"
                      >
                        <span>HUBUNGI VIA WHATSAPP</span>
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                          chat
                        </span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-3 bg-slate-900 text-slate-600 border border-slate-800 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl cursor-not-allowed"
                      >
                        <span>WHATSAPP TIDAK TERSEDIA</span>
                      </button>
                    )}
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