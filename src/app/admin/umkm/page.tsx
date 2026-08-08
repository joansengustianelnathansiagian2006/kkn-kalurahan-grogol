'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface UMKMItem {
  id?: string;
  nama: string;
  dusun: string;
  kategori: string;
  whatsapp?: string;
  deskripsi: string;
  foto_url: string;
}

const KATEGORI_OPTIONS = [
  'Kuliner',
  'Kerajinan',
  'Pertanian',
  'Jasa',
  'Fashion & Tekstil',
  'Lainnya',
];

const INITIAL_FORM: UMKMItem = {
  nama: '',
  dusun: 'Dusun Grogol',
  kategori: 'Kuliner',
  whatsapp: '',
  deskripsi: '',
  foto_url: '',
};

export default function AdminUMKMPage() {
  const [dataUmkm, setDataUmkm] = useState<UMKMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form & File
  const [formData, setFormData] = useState<UMKMItem>(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUMKM();
  }, []);

  const fetchUMKM = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('umkm')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setDataUmkm(data as UMKMItem[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalFotoUrl = formData.foto_url;

    // Jika pengguna memilih file baru dari perangkat, unggah ke Supabase Storage
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `umkm/${fileName}`;

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
      nama: formData.nama,
      dusun: formData.dusun,
      kategori: formData.kategori,
      whatsapp: formData.whatsapp || null,
      deskripsi: formData.deskripsi,
      foto_url: finalFotoUrl || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('umkm')
        .update(payload)
        .eq('id', editingId);

      if (error) alert('Gagal memperbarui data UMKM: ' + error.message);
    } else {
      const { error } = await supabase.from('umkm').insert([payload]);
      if (error) alert('Gagal menyimpan UMKM baru: ' + error.message);
    }

    setUploading(false);
    closeModal();
    fetchUMKM();
  };

  const handleEdit = (item: UMKMItem) => {
    if (item.id) setEditingId(item.id);
    setFormData(item);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data UMKM ini?')) {
      await supabase.from('umkm').delete().eq('id', id);
      fetchUMKM();
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
              Manajemen UMKM Kalurahan Grogol
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Daftarkan dan promosikan usaha warga, produk lokal unggulan, serta informasi kontak pelaku UMKM desa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Tambah UMKM</span>
          </button>
        </div>

        {/* Tabel Data UMKM */}
        <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
              Daftar UMKM Terdaftar
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total: {dataUmkm.length} Usaha
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              Memuat data UMKM...
            </div>
          ) : dataUmkm.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-xs">
              Belum ada data UMKM yang ditambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/60 font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 sm:px-6">Foto Produksi</th>
                    <th className="p-4 sm:px-6">Nama Usaha / UMKM</th>
                    <th className="p-4 sm:px-6">Kategori & Lokasi</th>
                    <th className="p-4 sm:px-6">Kontak WA</th>
                    <th className="p-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataUmkm.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:px-6">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                          {item.foto_url ? (
                            <Image
                              src={item.foto_url}
                              alt={item.nama}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <span className="material-symbols-outlined text-xl">
                                store
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <div className="font-bold text-slate-900 max-w-xs truncate">
                          {item.nama}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                          {item.deskripsi || '-'}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <span className="bg-emerald-50 text-[#064e3b] border border-emerald-100/80 font-bold px-2.5 py-1 rounded-lg text-[11px] uppercase block w-fit mb-1">
                          {item.kategori}
                        </span>
                        <span className="text-slate-500 font-medium">
                          {item.dusun}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-slate-600">
                        {item.whatsapp ? (
                          <a
                            href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-mono text-[11px] font-bold"
                          >
                            <span>💬 {item.whatsapp}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
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

        {/* Modal Form Tambah/Edit UMKM */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200/60 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#064e3b]">
                    {editingId ? 'edit_square' : 'add_business'}
                  </span>
                  <span>{editingId ? 'Edit Data UMKM' : 'Tambah UMKM Baru'}</span>
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
                {/* Nama Usaha */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Usaha / UMKM
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Keripik Pisang Ibu Ana"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Kategori & Dusun */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kategori Usaha
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
                      Dusun / Padukuhan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dusun Grogol"
                      value={formData.dusun}
                      onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Upload Foto Produk */}
                <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200/80">
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Upload Foto Produksi / Produk
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
                    Atau Input URL Foto (Opsional)
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

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Singkat Produksi / Produk
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Jelaskan produk unggulan, varian rasa, atau harga..."
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
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
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>{uploading ? 'Menyimpan...' : 'Simpan UMKM'}</span>
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