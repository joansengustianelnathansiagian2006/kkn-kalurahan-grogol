'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ArtikelItem {
  id?: string;
  judul: string;
  kategori: string;
  penulis: string;
  konten: string;
  foto_url: string;
  created_at?: string;
}

const KATEGORI_OPTIONS = [
  'Berita Desa',
  'Kegiatan KKN',
  'Pengumuman',
  'Edukasi',
  'Lainnya',
];

const INITIAL_FORM: ArtikelItem = {
  judul: '',
  kategori: 'Berita Desa',
  penulis: 'Tim KKN',
  konten: '',
  foto_url: '',
};

export default function AdminArtikelPage() {
  const [dataArtikel, setDataArtikel] = useState<ArtikelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ArtikelItem>(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('artikel')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setDataArtikel(data as ArtikelItem[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalFotoUrl = formData.foto_url;

    // Jika pengguna mengunggah gambar dari perangkat
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `artikel/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kkn-media')
        .upload(filePath, selectedFile);

      if (uploadError) {
        alert('Gagal mengunggah gambar ke storage: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('kkn-media')
        .getPublicUrl(filePath);

      finalFotoUrl = urlData.publicUrl;
    }

    const payload = {
      judul: formData.judul,
      kategori: formData.kategori,
      penulis: formData.penulis,
      konten: formData.konten,
      foto_url: finalFotoUrl || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('artikel')
        .update(payload)
        .eq('id', editingId);

      if (error) alert('Gagal memperbarui artikel: ' + error.message);
    } else {
      const { error } = await supabase.from('artikel').insert([payload]);
      if (error) alert('Gagal menerbitkan artikel: ' + error.message);
    }

    setUploading(false);
    closeModal();
    fetchArtikel();
  };

  const handleEdit = (item: ArtikelItem) => {
    if (item.id) setEditingId(item.id);
    setFormData(item);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      await supabase.from('artikel').delete().eq('id', id);
      fetchArtikel();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-slate-800 p-4 sm:p-8 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Hero Banner Header */}
        <div className="bg-[#e2ece6] border border-emerald-100/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="text-[11px] font-extrabold text-[#064e3b] uppercase tracking-wider block mb-1">
              ADMIN DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Artikel & Berita Kalurahan Grogol
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Publikasikan kabar terbaru, dokumentasi kegiatan KKN, pengumuman warga, serta artikel edukasi desa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">newspaper</span>
            <span>Tulis Artikel</span>
          </button>
        </div>

        {/* Tabel Data Artikel */}
        <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
              Daftar Artikel Terbit
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total: {dataArtikel.length} Artikel
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              Memuat daftar artikel...
            </div>
          ) : dataArtikel.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-xs">
              Belum ada artikel yang diterbitkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/60 font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 sm:px-6">Banner</th>
                    <th className="p-4 sm:px-6">Judul & Ringkasan</th>
                    <th className="p-4 sm:px-6">Kategori</th>
                    <th className="p-4 sm:px-6">Penulis & Tanggal</th>
                    <th className="p-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataArtikel.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:px-6">
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                          {item.foto_url ? (
                            <Image
                              src={item.foto_url}
                              alt={item.judul}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <span className="material-symbols-outlined text-xl">
                                article
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <div className="font-bold text-slate-900 max-w-sm line-clamp-1 text-xs">
                          {item.judul}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 max-w-sm mt-0.5 leading-snug">
                          {item.konten || '-'}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <span className="bg-emerald-50 text-[#064e3b] border border-emerald-100/80 font-bold px-2.5 py-1 rounded-lg text-[11px] uppercase inline-block">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6">
                        <div className="font-bold text-slate-700">
                          {item.penulis}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => item.id && handleDelete(item.id)}
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          <span>Hapus</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form Tambah/Edit Artikel */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200/60 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#064e3b]">
                    {editingId ? 'edit_document' : 'post_add'}
                  </span>
                  <span>{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Judul Artikel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Artikel
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pelatihan Digital Marketing UMKM Kalurahan Grogol"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Kategori & Penulis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kategori Artikel
                    </label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors cursor-pointer"
                    >
                      {KATEGORI_OPTIONS.map((kat) => (
                        <option key={kat} value={kat}>
                          {kat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Penulis
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tim KKN / Admin Desa"
                      value={formData.penulis}
                      onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Upload Gambar Banner */}
                <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200/80">
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Upload Gambar Utama / Banner
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#043e2f] cursor-pointer"
                  />
                </div>

                {/* Direct Image URL (Opsional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Atau Input URL Gambar Banner (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.foto_url}
                    disabled={!!selectedFile}
                    onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors disabled:opacity-50"
                  />
                  {selectedFile && (
                    <p className="text-[10px] text-amber-600 font-medium mt-1">
                      *Menggunakan foto yang diunggah dari perangkat.
                    </p>
                  )}
                </div>

                {/* Isi Konten Artikel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Isi Artikel / Berita
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Tuliskan isi berita atau artikel secara lengkap..."
                    value={formData.konten}
                    onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={uploading}
                    className="bg-slate-200 text-slate-700 font-bold text-xs uppercase px-5 py-3 rounded-2xl hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>{uploading ? 'Menerbitkan...' : 'Terbitkan Artikel'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}