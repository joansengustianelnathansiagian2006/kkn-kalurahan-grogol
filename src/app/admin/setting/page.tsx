'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ContactSettings {
  alamat: string;
  phone: string;
  email: string;
  jam_operasional: string;
  maps_embed_url: string;
  maps_direction_url: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export default function AdminPengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<ContactSettings>({
    alamat: '',
    phone: '',
    email: '',
    jam_operasional: '',
    maps_embed_url: '',
    maps_direction_url: '',
    instagram: '',
    facebook: '',
    youtube: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kontak_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData({
          alamat: data.alamat || '',
          phone: data.phone || '',
          email: data.email || '',
          jam_operasional: data.jam_operasional || '',
          maps_embed_url: data.maps_embed_url || '',
          maps_direction_url: data.maps_direction_url || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          youtube: data.youtube || '',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Gagal memuat pengaturan:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('kontak_settings')
        .upsert({ id: 1, ...formData });

      if (error) throw error;

      setSuccessMsg('Pengaturan kontak berhasil diperbarui di Supabase!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(`Gagal menyimpan: ${err.message}`);
      } else {
        setErrorMsg('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-slate-800 p-4 sm:p-8 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Header Hero Banner */}
          <div className="bg-[#e2ece6] border border-emerald-100/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div>
              <span className="text-[11px] font-extrabold text-[#064e3b] uppercase tracking-wider block mb-1">
                PENGATURAN ADMIN
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Kelola Informasi Kontak & Peta
              </h1>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
                Atur nomor WhatsApp, alamat kantor, peta lokasi, dan tautan sosial media Kalurahan.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap self-start md:self-auto disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>

          {/* Alert Success */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200/80 text-[#064e3b] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-sm">
              <span className="material-symbols-outlined text-xl">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Alert Error */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200/80 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-sm">
              <span className="material-symbols-outlined text-xl">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-500 font-medium">
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[#064e3b]">
                  progress_activity
                </span>
                <span className="text-xs">Memuat pengaturan kontak...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Card 1: Informasi Kontak Utama */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-[#064e3b] font-extrabold uppercase text-sm sm:text-base tracking-tight">
                    <span className="material-symbols-outlined text-xl">contact_phone</span>
                    <h2>Informasi Kontak Utama</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Kontak utama yang akan tampil di halaman depan website.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      Nomor WhatsApp / Telepon *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 6281234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Gunakan format internasional tanpa tanda + (contoh: 628123...)
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      Email Resmi *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="kalurahan@gunungkidulkab.go.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Jam Operasional */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                    Jam Operasional Layanan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Senin - Jumat (08:00 - 15:00 WIB)"
                    value={formData.jam_operasional}
                    onChange={(e) => setFormData({ ...formData, jam_operasional: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                    Alamat Lengkap Kantor Kalurahan *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jl. Raya Grogol No. 01, Kalurahan Grogol..."
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Card 2: Pengaturan Google Maps */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-[#064e3b] font-extrabold uppercase text-sm sm:text-base tracking-tight">
                    <span className="material-symbols-outlined text-xl">map</span>
                    <h2>Pengaturan Peta Lokasi (Google Maps)</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrasi Google Maps Embed dan Tautan Petunjuk Arah.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      URL Embed Google Maps (iFrame src)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      value={formData.maps_embed_url}
                      onChange={(e) => setFormData({ ...formData, maps_embed_url: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      URL Petunjuk Arah (Directions Link)
                    </label>
                    <input
                      type="text"
                      placeholder="https://maps.google.com/?q=..."
                      value={formData.maps_direction_url}
                      onChange={(e) => setFormData({ ...formData, maps_direction_url: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Media Sosial */}
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-[#064e3b] font-extrabold uppercase text-sm sm:text-base tracking-tight">
                    <span className="material-symbols-outlined text-xl">share</span>
                    <h2>Tautan Media Sosial</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Masukkan link profil media sosial resmi milik Kalurahan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/..."
                      value={formData.youtube}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}