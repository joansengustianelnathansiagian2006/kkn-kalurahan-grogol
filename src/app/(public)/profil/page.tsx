'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ProfilData {
  sejarah?: string;
  visi?: string;
  misi?: string;
  luas_wilayah?: string;
  batas_utara?: string;
  batas_selatan?: string;
  batas_barat?: string;
  batas_timur?: string;
  total_penduduk?: string;
  jumlah_kk?: string;
  pria?: string;
  wanita?: string;
  peta_embed_url?: string;
  struktur_pemerintahan_url?: string;
  padukuhan_list?: string;
  fasilitas_umum?: string;
}

// Fungsi pembantu mengekstrak URL 
const formatMapUrl = (rawUrl?: string) => {
  if (!rawUrl) return '';
  const iframeMatch = rawUrl.match(/src=["']([^"']+)["']/);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }
  return rawUrl.trim();
};

export default function ProfilPage() {
  const [profil, setProfil] = useState<ProfilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      const { data } = await supabase
        .from('profil_desa')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data) setProfil(data);
      setLoading(false);
    };

    fetchProfil();
  }, []);

  const padukuhanList = profil?.padukuhan_list
    ? profil.padukuhan_list.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  const misiList = profil?.misi
    ? profil.misi.split('\n').filter(Boolean)
    : [];

  const fasilitasList = profil?.fasilitas_umum
    ? profil.fasilitas_umum.split('\n').filter(Boolean)
    : [];

  const cleanMapUrl = formatMapUrl(profil?.peta_embed_url);

  if (loading) {
    return (
      <div className="w-full bg-slate-50 min-h-screen py-32 flex justify-center items-center text-slate-500 font-medium text-sm">
        Memuat data profil desa...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen py-8 pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-slate-100/60 border-y border-slate-200/50 py-4 px-6 md:px-12 w-full">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-900">Profil Desa</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-32 z-30">
          <nav
            id="scroll-spy"
            className="flex flex-col gap-3 p-6 bg-white/80 backdrop-blur-xl shadow-sm border border-slate-200/60 rounded-2xl"
          >
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Navigasi Profil
            </h3>
            <a
              href="#sejarah"
              className="spy-link text-sm font-medium text-slate-600 hover:text-emerald-700 transition-all flex items-center gap-2 group"
            >
              <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-600 transition-colors" />
              Sejarah
            </a>
            <a
              href="#visi-misi"
              className="spy-link text-sm font-medium text-slate-600 hover:text-emerald-700 transition-all flex items-center gap-2 group"
            >
              <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-600 transition-colors" />
              Visi &amp; Misi
            </a>
            {profil?.struktur_pemerintahan_url && (
              <a
                href="#struktur"
                className="spy-link text-sm font-medium text-slate-600 hover:text-emerald-700 transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-600 transition-colors" />
                Struktur Pemerintahan
              </a>
            )}
            <a
              href="#geografi"
              className="spy-link text-sm font-medium text-slate-600 hover:text-emerald-700 transition-all flex items-center gap-2 group"
            >
              <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-600 transition-colors" />
              Geografi &amp; Demografi
            </a>
            <a
              href="#padukuhan"
              className="spy-link text-sm font-medium text-slate-600 hover:text-emerald-700 transition-all flex items-center gap-2 group"
            >
              <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-emerald-600 transition-colors" />
              Padukuhan &amp; Fasilitas
            </a>
          </nav>
        </aside>

        {/* Content Sections */}
        <div className="lg:col-span-9 flex flex-col gap-16">
          
          {/* SECTION 1: SEJARAH */}
          <section id="sejarah" className="scroll-mt-36">
            <div className="relative bg-emerald-900 text-emerald-100 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl group mb-8">
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEfOz3dwruTmFqiUH0BmNE7hFy6LV2UH_ZvLG-VeV2xKV617YtffWUkpKc6tCHpsOS-zuUfr7m21GPcj0wYYljgQOmw2FmGYZi-e_VDbS53EAwEyUTfAq6c3_Jr9De88TltDwb9iKOjoj9lWxG3qAyKhCr_I09-zDR4V-HUmDEQRgyhvAvpr8uT7K75rch5oyWiySCQrb3Nw-5TrW1LkhwzZD_hcZWz9Jjw6cWFRvgV-NZCBYsaK6vxQ')",
                }}
              />
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3 block">
                  Asal Usul &amp; Historis
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white leading-tight">
                  Sejarah Desa
                </h2>
                <p className="text-base md:text-lg text-emerald-100/90 leading-relaxed">
                  Mengenal perjalanan historis dan kearifan lokal yang membentuk nilai-nilai kemasyarakatan hingga era modern.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm text-slate-700 text-base leading-relaxed whitespace-pre-line">
              {profil?.sejarah || 'Informasi sejarah desa belum dimasukkan.'}
            </div>
          </section>

          {/* SECTION 2: VISI MISI */}
          <section id="visi-misi" className="scroll-mt-36">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visi */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-700">
                  <span className="material-symbols-outlined text-2xl">visibility</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi</h3>
                <p className="text-lg text-emerald-800 italic leading-relaxed">
                  &quot;{profil?.visi || 'Visi belum diatur.'}&quot;
                </p>
              </div>

              {/* Misi */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-700">
                  <span className="material-symbols-outlined text-2xl">flag</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi</h3>
                {misiList.length > 0 ? (
                  <ul className="flex flex-col gap-3 text-sm md:text-base text-slate-600">
                    {misiList.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-emerald-700 font-bold">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span>{item.replace(/^\d+[\.\)]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Misi belum diatur.</p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3: STRUKTUR PEMERINTAHAN */}
          {profil?.struktur_pemerintahan_url && (
            <section id="struktur" className="scroll-mt-36">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                Struktur Pemerintahan Desa
              </h2>
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <img
                  src={profil.struktur_pemerintahan_url}
                  alt="Bagan Struktur Pemerintahan"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </section>
          )}

          {/* SECTION 4: GEOGRAFI & DEMOGRAFI */}
          <section id="geografi" className="scroll-mt-36">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Geografi &amp; Demografi
              </h2>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm border border-slate-200/60 hover:scale-[1.02] transition-transform">
                  <span className="material-symbols-outlined text-3xl text-emerald-600 mb-2">landscape</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {profil?.luas_wilayah || '-'}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase mt-1">Luas Wilayah</span>
                </div>
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm border border-slate-200/60 hover:scale-[1.02] transition-transform">
                  <span className="material-symbols-outlined text-3xl text-purple-600 mb-2">group</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {profil?.total_penduduk || '0'}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase mt-1">Total Penduduk</span>
                </div>
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm border border-slate-200/60 hover:scale-[1.02] transition-transform">
                  <span className="material-symbols-outlined text-3xl text-blue-600 mb-2">home_work</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {profil?.jumlah_kk || '0'}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase mt-1">Kepala Keluarga</span>
                </div>
                <div className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-sm border border-slate-200/60 hover:scale-[1.02] transition-transform">
                  <span className="material-symbols-outlined text-3xl text-emerald-700 mb-2">share_location</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900">
                    {padukuhanList.length}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase mt-1">Padukuhan</span>
                </div>
              </div>

              {/* Batas-Batas Wilayah */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-1">
                  <span>📍</span> Batas Wilayah:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-emerald-700">Utara</span>
                    <span>{profil?.batas_utara || '-'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-emerald-700">Selatan</span>
                    <span>{profil?.batas_selatan || '-'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-emerald-700">Barat</span>
                    <span>{profil?.batas_barat || '-'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-emerald-700">Timur</span>
                    <span>{profil?.batas_timur || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="w-full h-96 rounded-3xl overflow-hidden shadow-md relative bg-slate-100 border border-slate-200">
                {cleanMapUrl ? (
                  <iframe
                    src={cleanMapUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Peta Wilayah Desa"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <span className="material-symbols-outlined text-4xl">map</span>
                    <span className="text-xs font-medium">Peta interaktif belum dikonfigurasi admin</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 5: PADUKUHAN & FASILITAS */}
          <section id="padukuhan" className="scroll-mt-36">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              Padukuhan &amp; Fasilitas Umum
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Padukuhan */}
              <div className="bg-white shadow-sm border border-slate-200/60 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700">signpost</span> Daftar Padukuhan
                </h3>
                {padukuhanList.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {padukuhanList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 hover:bg-emerald-50/50 rounded-lg transition-colors font-semibold text-slate-800 text-sm border border-transparent hover:border-emerald-100"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Daftar padukuhan belum dimasukkan.</p>
                )}
              </div>

              {/* Fasilitas */}
              <div className="bg-white shadow-sm border border-slate-200/60 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700">local_hospital</span> Fasilitas Umum
                </h3>
                {fasilitasList.length > 0 ? (
                  <ul className="flex flex-col gap-3 text-sm text-slate-700">
                    {fasilitasList.map((fasilitas, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                        <span className="font-medium text-slate-800">{fasilitas}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">Fasilitas umum belum dimasukkan.</p>
                )}
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}