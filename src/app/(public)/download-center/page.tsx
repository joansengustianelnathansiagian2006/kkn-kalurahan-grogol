'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface DownloadItem {
  id: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  file_url: string;
  file_size: string;
  download_count: number;
}

export default function DownloadCenterPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Animasi Velocity GSAP
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

  const fetchDownloads = async () => {
    const { data } = await supabase
      .from('downloads')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setDownloads(data);
    setLoading(false);
  };

  // GSAP ScrollTrigger 
  useEffect(() => {
    if (loading || downloads.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray<HTMLElement>('.left-card');

    cards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 25%',  
        end: 'bottom 25%', 
        onToggle: (self) => {
          if (self.isActive) {
            setActiveIndex(index);
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading, downloads]);

  // Fungsi Direct Download
  const handleDownload = async (item: DownloadItem) => {
    try {
      setIsDownloading(true);

      // Update unduhan Supabase
      await supabase
        .from('downloads')
        .update({ download_count: (item.download_count || 0) + 1 })
        .eq('id', item.id);

      // Ambil file sebagai Blob
      const response = await fetch(item.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      // nama file
      const fileExtension = item.file_url.split('.').pop() || 'pdf';
      link.download = `${item.judul}.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      fetchDownloads();
    } catch (error) {
      // Fallback jika terjadi CORS block
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.judul;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-mono text-sm">
        <p className="animate-pulse">Memuat Download Center...</p>
      </div>
    );
  }

  if (downloads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">PUSAT UNDUHAN</h1>
        <p className="text-slate-400 max-w-md text-sm">
          Belum ada dokumen yang diunggah. Silakan cek kembali secara berkala.
        </p>
      </div>
    );
  }

  const activeItem = downloads[activeIndex] || downloads[0];

  return (
    <div className="bg-slate-950 text-white font-sans relative">
      <div className="flex flex-col lg:flex-row">
        
        {/* SISI KIRI */}
        <div className="w-full lg:w-1/2 relative">
          {downloads.map((item, index) => (
            <div
              key={item.id}
              className="left-card sticky top-0 h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900/60 border-r border-emerald-800/30 shadow-2xl overflow-hidden"
              style={{ zIndex: index + 1 }}
            >
              {/* Header Informasi Kartu */}
              <div className="relative z-10 text-center select-none mb-4">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 shadow-lg backdrop-blur-md mb-2">
                  [{item.kategori}]
                </span>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white/90">
                  FILE #{String(index + 1).padStart(2, '0')}
                </h1>
              </div>

              {/* Frame Tampilan Preview PDF */}
              <div className="relative z-10 w-full max-w-lg h-[65vh] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/90 shadow-2xl backdrop-blur-sm">
                <iframe
                  src={`${item.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={`Preview ${item.judul}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* SISI KANAN */}
        <div className="w-full lg:w-1/2 h-screen sticky top-0 flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-slate-950 z-30 border-l border-slate-900/80">
          <div ref={contentRef} className="max-w-xl">
            
            {/* Kategori & Ukuran File */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeItem.kategori}
              </span>
              {activeItem.file_size && (
                <span className="text-xs font-mono text-slate-500">
                  {activeItem.file_size}
                </span>
              )}
            </div>

            {/* Nama File */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase leading-tight">
              {activeItem.judul}
            </h2>

            {/* Deskripsi Teks */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 font-light min-h-[50px]">
              {activeItem.deskripsi || 'Tidak ada penjelasan khusus untuk berkas ini.'}
            </p>

            {/* Tombol Unduh & Jumlah Unduhan */}
            <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => handleDownload(activeItem)}
                disabled={isDownloading}
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-950 hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                <span>{isDownloading ? 'MENGUNDUH...' : 'UNDUH BERKAS'}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-y-0.5 transition-transform">
                  download
                </span>
              </button>

              <span className="text-[11px] font-mono text-slate-500">
                diunduh: {activeItem.download_count || 0} kali
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}