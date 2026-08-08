'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminProfilWebsitePage() {
  const [activeTab, setActiveTab] = useState('umum');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    sejarah: '',
    visi: '',
    misi: '',
    luas_wilayah: '',
    batas_utara: '',
    batas_selatan: '',
    batas_barat: '',
    batas_timur: '',
    total_penduduk: '',
    jumlah_kk: '',
    pria: '',
    wanita: '',
    peta_embed_url: '',
    struktur_pemerintahan_url: '',
    padukuhan_list: '',
    fasilitas_umum: '',
  });

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    setLoading(true);
    const { data } = await supabase.from('profil_desa').select('*').eq('id', 1).maybeSingle();
    if (data) setFormData((prev) => ({ ...prev, ...data }));
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { error } = await supabase.from('profil_desa').upsert({
      id: 1,
      ...formData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage('❌ Gagal menyimpan data!');
    } else {
      setMessage('✅ Profil desa berhasil diperbarui!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f3] flex items-center justify-center p-6 text-slate-600 font-medium text-xs">
        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200/60">
          <span className="material-symbols-outlined animate-spin text-[#064e3b]">
            progress_activity
          </span>
          <span>Memuat data profil website...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-slate-800 p-4 sm:p-8 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Hero Banner */}
        <div className="bg-[#e2ece6] border border-emerald-100/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-[11px] font-extrabold text-[#064e3b] uppercase tracking-wider block mb-1">
              ADMIN DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kelola Profil Website
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Ubah data informasi umum, geografis, demografi, struktur pemerintahan, dan fasilitas umum desa.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

        {/* Notifikasi Message */}
        {message && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2 shadow-sm ${
              message.includes('❌')
                ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                : 'bg-emerald-50 text-[#064e3b] border-emerald-200/80'
            }`}
          >
            <span>{message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm flex gap-2 overflow-x-auto">
          {[
            { id: 'umum', label: 'Sejarah & Visi Misi', icon: 'auto_stories' },
            { id: 'geografi', label: 'Geografis & Peta', icon: 'map' },
            { id: 'demografi', label: 'Demografi', icon: 'groups' },
            { id: 'struktur', label: 'Struktur & Dusun', icon: 'account_tree' },
            { id: 'fasilitas', label: 'Fasilitas Umum', icon: 'local_hospital' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#064e3b] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Tab 1: Sejarah, Visi, Misi */}
          {activeTab === 'umum' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sejarah Desa
                </label>
                <textarea
                  name="sejarah"
                  rows={5}
                  value={formData.sejarah || ''}
                  onChange={handleChange}
                  placeholder="Tuliskan sejarah singkat desa..."
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Visi Desa
                </label>
                <textarea
                  name="visi"
                  rows={3}
                  value={formData.visi || ''}
                  onChange={handleChange}
                  placeholder="Tuliskan visi desa..."
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Misi Desa (Pisahkan dengan baris baru)
                </label>
                <textarea
                  name="misi"
                  rows={5}
                  value={formData.misi || ''}
                  onChange={handleChange}
                  placeholder="1. Misi pertama&#10;2. Misi kedua"
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Geografis & Peta */}
          {activeTab === 'geografi' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Luas Wilayah (misal: 12.5 km²)
                </label>
                <input
                  type="text"
                  name="luas_wilayah"
                  value={formData.luas_wilayah || ''}
                  onChange={handleChange}
                  placeholder="12.5 km²"
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Batas Utara
                  </label>
                  <input
                    type="text"
                    name="batas_utara"
                    value={formData.batas_utara || ''}
                    onChange={handleChange}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Batas Selatan
                  </label>
                  <input
                    type="text"
                    name="batas_selatan"
                    value={formData.batas_selatan || ''}
                    onChange={handleChange}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Batas Barat
                  </label>
                  <input
                    type="text"
                    name="batas_barat"
                    value={formData.batas_barat || ''}
                    onChange={handleChange}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Batas Timur
                  </label>
                  <input
                    type="text"
                    name="batas_timur"
                    value={formData.batas_timur || ''}
                    onChange={handleChange}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Embed Google Maps (iframe src)
                </label>
                <input
                  type="text"
                  name="peta_embed_url"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={formData.peta_embed_url || ''}
                  onChange={handleChange}
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Demografi */}
          {activeTab === 'demografi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Penduduk
                </label>
                <input
                  type="text"
                  name="total_penduduk"
                  value={formData.total_penduduk || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 3,450"
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jumlah Kepala Keluarga (KK)
                </label>
                <input
                  type="text"
                  name="jumlah_kk"
                  value={formData.jumlah_kk || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 850"
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jumlah Laki-laki
                </label>
                <input
                  type="text"
                  name="pria"
                  value={formData.pria || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 1,700"
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jumlah Perempuan
                </label>
                <input
                  type="text"
                  name="wanita"
                  value={formData.wanita || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 1,750"
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Struktur & Padukuhan */}
          {activeTab === 'struktur' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  URL Gambar Bagan Struktur Pemerintahan
                </label>
                <input
                  type="text"
                  name="struktur_pemerintahan_url"
                  placeholder="https://.../gambar.jpg"
                  value={formData.struktur_pemerintahan_url || ''}
                  onChange={handleChange}
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Daftar Padukuhan/Dusun (Pisahkan dengan koma)
                </label>
                <textarea
                  name="padukuhan_list"
                  rows={4}
                  placeholder="Dusun Krajan, Dusun Mawar, Dusun Anggrek..."
                  value={formData.padukuhan_list || ''}
                  onChange={handleChange}
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Fasilitas Umum */}
          {activeTab === 'fasilitas' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fasilitas Umum (Pisahkan dengan baris baru)
                </label>
                <textarea
                  name="fasilitas_umum"
                  rows={6}
                  placeholder="1. Puskesmas Pembantu&#10;2. SD Negeri 1 Desa&#10;3. Masjid Agung&#10;4. Lapangan Olahraga"
                  value={formData.fasilitas_umum || ''}
                  onChange={handleChange}
                  className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}