'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ArtikelItem {
  id: string;
  slug?: string; 
  judul: string;
  kategori: string;
  penulis: string;
  konten: string;
  foto_url: string;
  created_at: string;
}

export default function BeritaPage() {
  const [dataArtikel, setDataArtikel] = useState<ArtikelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchArtikel = async () => {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDataArtikel(data);
      }
      setLoading(false);
    };

    fetchArtikel();
  }, []);

  const filtered = dataArtikel.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.konten.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Kabar Desa</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Berita & Artikel Grogol</h1>
          <p className="text-xs text-slate-500 mt-1">Informasi dan kegiatan terbaru seputar Kalurahan Grogol.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Cari berita atau artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">search</span>
        </div>
      </div>

      {/* Grid Artikel */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Memuat artikel...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">Belum ada artikel yang diterbitkan.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug || item.id}`}
              className="group block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Container Gambar + Gradasi + Hover Zoom */}
                  <div className="relative h-52 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        Tidak ada gambar
                      </div>
                    )}

                    {/* Gradasi Bayangan Gelap pada Gambar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Badge Kategori */}
                    <span className="absolute top-4 left-4 z-10 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Body Teks */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <span>Oleh {item.penulis}</span>
                      <span>•</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {item.konten}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-6 pt-0 text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>Baca Selengkapnya</span>
                  <span className="text-sm">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}