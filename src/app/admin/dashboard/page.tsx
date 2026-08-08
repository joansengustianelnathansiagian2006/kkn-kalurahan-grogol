'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface StatsData {
  totalArtikel: number;
  totalProker: number;
  totalUmkm: number;
  totalTimKkn: number;
}

interface UMKMItem {
  id: string;
  nama: string;
  dusun: string;
  kategori: string;
  foto_url?: string;
  whatsapp?: string;
}

interface ActivityItem {
  id: string;
  judul: string;
  tipe: 'Artikel' | 'UMKM';
  waktu: string;
  keterangan: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalArtikel: 0,
    totalProker: 0,
    totalUmkm: 0,
    totalTimKkn: 0,
  });

  const [recentUmkm, setRecentUmkm] = useState<UMKMItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Format tanggal hari ini dalam Bahasa Indonesia
  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // 1. Ambil Total Hitungan Data Secara Paralel
      const [
        { count: countArtikel },
        { count: countProker },
        { count: countUmkm },
        { count: countTim },
      ] = await Promise.all([
        supabase.from('artikel').select('*', { count: 'exact', head: true }),
        supabase.from('proker').select('*', { count: 'exact', head: true }),
        supabase.from('umkm').select('*', { count: 'exact', head: true }),
        supabase.from('tim_kkn').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalArtikel: countArtikel || 0,
        totalProker: countProker || 0,
        totalUmkm: countUmkm || 0,
        totalTimKkn: countTim || 0,
      });

      // 2. Ambil Data UMKM Terbaru (Top 5)
      const { data: umkmData } = await supabase
        .from('umkm')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (umkmData) setRecentUmkm(umkmData as UMKMItem[]);

      // 3. Ambil Aktivitas Terkini (Kombinasi Artikel & UMKM Terbaru)
      const { data: latestArtikel } = await supabase
        .from('artikel')
        .select('id, judul, penulis, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      const { data: latestUmkm } = await supabase
        .from('umkm')
        .select('id, nama, dusun, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      const combinedActivities: ActivityItem[] = [];

      latestArtikel?.forEach((art) => {
        combinedActivities.push({
          id: `art-${art.id}`,
          judul: 'Artikel Baru Dipublikasikan',
          tipe: 'Artikel',
          keterangan: `"${art.judul}" oleh ${art.penulis}`,
          waktu: art.created_at
            ? new Date(art.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })
            : 'Baru saja',
        });
      });

      latestUmkm?.forEach((u) => {
        combinedActivities.push({
          id: `umkm-${u.id}`,
          judul: 'Profil UMKM Ditambahkan',
          tipe: 'UMKM',
          keterangan: `Usaha "${u.nama}" dari ${u.dusun}`,
          waktu: u.created_at
            ? new Date(u.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })
            : 'Baru saja',
        });
      });

      setActivities(combinedActivities);
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-slate-800 p-4 sm:p-8 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Welcome Banner */}
        <div className="bg-[#e2ece6] border border-emerald-100/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[11px] font-extrabold text-[#064e3b] uppercase tracking-wider block mb-1">
              ADMIN DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang, Admin!
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-xl">
              Pantau dan kelola seluruh aktivitas digital KKN Grogol dari satu pusat kendali terpadu secara otomatis.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/60 rounded-2xl px-4 py-2.5 flex items-center gap-2 self-start md:self-auto text-xs font-bold text-slate-700 shadow-sm">
            <span className="material-symbols-outlined text-emerald-800 text-base">calendar_today</span>
            <span>{todayFormatted}</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Artikel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL ARTIKEL</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">article</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : stats.totalArtikel}
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                Terhubung Database
              </span>
            </div>
          </div>

          {/* Card 2: Program Kerja */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">PROGRAM KERJA AKTIF</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">assignment</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : stats.totalProker}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                Progres KKN
              </span>
            </div>
          </div>

          {/* Card 3: Mitra UMKM */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">MITRA UMKM</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">storefront</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : stats.totalUmkm}
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                Terverifikasi
              </span>
            </div>
          </div>

          {/* Card 4: Anggota Tim KKN */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">ANGGOTA TIM KKN</span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">groups</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {loading ? '...' : stats.totalTimKkn}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                Personil Aktif
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Left (Aksi Cepat & Aktivitas) | Right (Daftar UMKM Terbaru) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* SISI KIRI: Aksi Cepat & Aktivitas Terkini */}
          <div className="space-y-6">
            
            {/* Box 1: Aksi Cepat */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-amber-500 text-base">bolt</span>
                <span>Aksi Cepat</span>
              </h3>

              <Link
                href="/admin/artikel"
                className="w-full bg-[#064e3b] hover:bg-[#043e2f] text-white p-3 rounded-2xl flex items-center justify-between transition-all shadow-sm text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">add_box</span>
                  <span>Tambah Berita Baru</span>
                </div>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>

              <Link
                href="/admin/proker"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between transition-all text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-slate-600">edit_note</span>
                  <span>Update Progres Proker</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-400">arrow_forward</span>
              </Link>

              <Link
                href="/admin/galeri"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between transition-all text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-slate-600">photo_library</span>
                  <span>Kelola Galeri</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-400">arrow_forward</span>
              </Link>
            </div>

            {/* Box 2: Aktivitas Terkini */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Aktivitas Terkini
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Realtime
                </span>
              </div>

              {loading ? (
                <p className="text-xs text-slate-400">Memuat aktivitas...</p>
              ) : activities.length === 0 ? (
                <p className="text-xs text-slate-400">Belum ada aktivitas terbaru.</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{act.judul}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{act.waktu}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{act.keterangan}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* SISI KANAN: Data UMKM Terbaru */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    Data UMKM Terbaru
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Unit usaha lokal yang baru diinputkan ke sistem
                  </p>
                </div>
                <Link
                  href="/admin/umkm"
                  className="text-xs text-[#064e3b] hover:underline font-bold"
                >
                  Lihat Semua
                </Link>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400">Memuat data UMKM...</div>
              ) : recentUmkm.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">Belum ada data UMKM.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 border-b border-slate-200/60 font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4 sm:px-6">Nama Usaha</th>
                        <th className="p-4 sm:px-6">Kategori</th>
                        <th className="p-4 sm:px-6">WhatsApp</th>
                        <th className="p-4 sm:px-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentUmkm.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                {item.foto_url ? (
                                  <Image
                                    src={item.foto_url}
                                    alt={item.nama}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-base">store</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{item.nama}</div>
                                <div className="text-[11px] text-slate-400">{item.dusun}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:px-6">
                            <span className="bg-emerald-50 text-[#064e3b] font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase border border-emerald-100/80">
                              {item.kategori}
                            </span>
                          </td>
                          <td className="p-4 sm:px-6 font-mono text-[11px] text-slate-600">
                            {item.whatsapp || '-'}
                          </td>
                          <td className="p-4 sm:px-6 text-right">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>Aktif</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
              <span className="text-[11px] text-slate-400 font-medium">
                Data disinkronkan langsung dari tabel database Kalurahan Grogol
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}