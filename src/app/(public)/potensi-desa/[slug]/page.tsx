'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface PotensiDetail {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  lokasi?: string;
  kontak?: string;
}

export default function DetailPotensiDesaPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [data, setData] = useState<PotensiDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      // Query murni berdasarkan slug
      const { data: result, error } = await supabase
        .from('potensi_desa')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching detail:', error);
      }

      if (result) {
        setData({
          id: result.id,
          slug: result.slug,
          title: result.title || result.judul || '',
          category: result.category || result.kategori || 'Potensi lainnya',
          description: result.description || result.deskripsi || '',
          image: result.image || result.gambar_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800',
          lokasi: result.lokasi,
          kontak: result.kontak,
        });
      }
      setLoading(false);
    };

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center text-xs text-slate-400">
        Memuat detail potensi...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Potensi Tidak Ditemukan</h1>
        <p className="text-xs text-slate-500 mt-2">
          Data dengan slug <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{slug}</code> tidak ditemukan di database.
        </p>
        <Link href="/potensi-desa" className="mt-6 inline-block text-xs font-semibold text-emerald-600 hover:underline">
          &larr; Kembali ke Potensi Desa
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-28">
      <Link
        href="/potensi-desa"
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Kembali ke Potensi Desa
      </Link>

      <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 md:p-10 shadow-sm">
        <span className="inline-block bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-4">
          {data.category}
        </span>

        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
          {data.title}
        </h1>

        {data.image && (
          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-8 bg-slate-100 dark:bg-slate-800">
            <Image
              src={data.image}
              alt={data.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <div className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-8">
          {data.description}
        </div>

        {(data.lokasi || data.kontak) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            {data.lokasi && (
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-base text-emerald-600">location_on</span>
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Lokasi</span>
                  {data.lokasi}
                </div>
              </div>
            )}
            {data.kontak && (
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-base text-emerald-600">call</span>
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Kontak / Pengelola</span>
                  {data.kontak}
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}