'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ArtikelItem {
  id: string;
  slug?: string;
  judul: string;
  kategori: string;
  penulis: string;
  konten: string;
  foto_url?: string;
  foto_url_2?: string;
  created_at: string;
}

export default function DetailBeritaPage() {
  const params = useParams();
  const slugParam = params?.slug as string;

  const [artikel, setArtikel] = useState<ArtikelItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugParam) return;

    const fetchDetail = async () => {
      setLoading(true);

      // Cek berdasarkan ID
      let { data } = await supabase
        .from('artikel')
        .select('*')
        .eq('id', slugParam)
        .maybeSingle();

      // Jika tidak ada, cek berdasarkan Slug
      if (!data) {
        const resSlug = await supabase
          .from('artikel')
          .select('*')
          .eq('slug', slugParam)
          .maybeSingle();
        data = resSlug.data;
      }

      if (data) setArtikel(data);
      setLoading(false);
    };

    fetchDetail();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center text-slate-600 font-medium text-sm">
        Memuat artikel...
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Artikel Tidak Ditemukan
        </h1>
        <p className="text-xs text-slate-600 mb-6">
          Artikel dengan ID/Slug "<span className="font-mono text-emerald-600">{slugParam}</span>" tidak ditemukan.
        </p>
        <Link href="/berita" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
          ← Kembali ke daftar berita
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-32">
      {/* Tombol Kembali */}
      <Link
        href="/berita"
        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 mb-6 transition-all"
      >
        <span>← Kembali ke Berita</span>
      </Link>

      {/* Header Berita */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <span className="inline-block bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-sm">
          {artikel.kategori || 'Berita'}
        </span>
        
        {/* Judul Kontras Tinggi */}
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
          {artikel.judul}
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span>Oleh <strong className="text-slate-900 font-bold">{artikel.penulis || 'Admin'}</strong></span>
          <span>•</span>
          <span>
            {new Date(artikel.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Container Gambar */}
      {(artikel.foto_url || artikel.foto_url_2) && (
        <div className={`grid gap-4 mb-8 ${artikel.foto_url && artikel.foto_url_2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
         {artikel.foto_url && (
            <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img
                src={artikel.foto_url}
                alt={`${artikel.judul} - 1`}
                className="w-full h-full object-cover"
          />
        </div>
      )}

      {artikel.foto_url_2 && (
        <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <img
            src={artikel.foto_url_2}
            alt={`${artikel.judul} - 2`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
   )}

      {/* Konten Utama Teks Hitam Pekat */}
      <div className="text-slate-800 text-base md:text-lg leading-relaxed whitespace-pre-line font-normal space-y-4">
        {artikel.konten}
      </div>
    </div>
  );
}