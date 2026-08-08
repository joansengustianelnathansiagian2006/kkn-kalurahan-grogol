'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ProkerDetail {
  id: string;
  slug?: string;
  nama: string;
  kategori: string;
  tanggal: string;
  lokasi: string;
  cover_url?: string;
  latar_belakang?: string;
  tujuan?: string;
  pelaksanaan?: string;
  hasil?: string;
  manfaat?: string;
  dokumentasi_foto?: string[];
  dokumentasi_video?: string;
  file_url?: string;
}

// Helper konversi URL YouTube ke format Embed
const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
};

export default function DetailProkerPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slugParam = resolvedParams?.slug;

  const [proker, setProker] = useState<ProkerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugParam) return;

    const fetchDetail = async () => {
      setLoading(true);

      // berdasarkan kolom slug
      let { data } = await supabase
        .from('proker')
        .select('*')
        .eq('slug', slugParam)
        .maybeSingle();

      // cari berdasarkan ID
      if (!data) {
        const resId = await supabase
          .from('proker')
          .select('*')
          .eq('id', slugParam)
          .maybeSingle();
        data = resId.data;
      }

      if (data) setProker(data);
      setLoading(false);
    };

    fetchDetail();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center text-slate-600 font-medium text-sm">
        Memuat detail program kerja...
      </div>
    );
  }

  if (!proker) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Program Kerja Tidak Ditemukan</h1>
        <p className="text-xs text-slate-600 mb-6">
          Slug yang dicari: "<span className="font-mono text-emerald-600">{slugParam}</span>"
        </p>
        <Link href="/program-kerja" className="text-emerald-600 font-bold text-sm hover:underline">
          ← Kembali ke daftar program kerja
        </Link>
      </div>
    );
  }

  const youtubeEmbedUrl = proker.dokumentasi_video
    ? getYouTubeEmbedUrl(proker.dokumentasi_video)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-32">
      <Link href="/program-kerja" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 mb-6 hover:underline">
        <span>← Kembali ke Program Kerja</span>
      </Link>

      <div className="mb-6">
        <span className="inline-block bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          {proker.kategori}
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{proker.nama}</h1>
        <div className="flex flex-wrap gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>📍 <strong>Lokasi:</strong> {proker.lokasi}</div>
          <div>📅 <strong>Pelaksanaan:</strong> {proker.tanggal}</div>
        </div>
      </div>

      {proker.cover_url && (
        <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden mb-10 border border-slate-200 shadow-sm bg-slate-100">
          <img src={proker.cover_url} alt={proker.nama} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="space-y-8 text-slate-800 text-base leading-relaxed">
        {proker.latar_belakang && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">📌 Latar Belakang</h2>
            <p className="whitespace-pre-line text-slate-700">{proker.latar_belakang}</p>
          </section>
        )}

        {proker.tujuan && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">🎯 Tujuan</h2>
            <p className="whitespace-pre-line text-slate-700">{proker.tujuan}</p>
          </section>
        )}

        {proker.pelaksanaan && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">🛠️ Pelaksanaan</h2>
            <p className="whitespace-pre-line text-slate-700">{proker.pelaksanaan}</p>
          </section>
        )}

        {proker.hasil && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">📈 Hasil</h2>
            <p className="whitespace-pre-line text-slate-700">{proker.hasil}</p>
          </section>
        )}

        {proker.manfaat && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">💡 Manfaat</h2>
            <p className="whitespace-pre-line text-slate-700">{proker.manfaat}</p>
          </section>
        )}

        {proker.dokumentasi_foto && proker.dokumentasi_foto.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">🖼️ Dokumentasi Foto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proker.dokumentasi_foto.map((url, idx) => (
                <div key={idx} className="h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={url} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seksi Player YouTube Responsive */}
        {proker.dokumentasi_video && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">🎥 Dokumentasi Video</h2>
            {youtubeEmbedUrl ? (
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-black">
                <iframe
                  src={youtubeEmbedUrl}
                  title={`Dokumentasi Video - ${proker.nama}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <a
                href={proker.dokumentasi_video}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-red-700 transition-all"
              >
                <span>Tonton Video Dokumentasi</span> ↗
              </a>
            )}
          </section>
        )}

        {proker.file_url && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">📁 Berkas Digital</h2>
            <a
              href={proker.file_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-slate-800 transition-all"
            >
              <span>Unduh Berkas Pendukung</span> 💾
            </a>
          </section>
        )}
      </div>
    </div>
  );
}