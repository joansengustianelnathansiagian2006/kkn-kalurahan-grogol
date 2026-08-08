'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface PotensiItem {
  id?: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  lokasi: string;
  kontak: string;
}

const CATEGORIES = [
  'Pertanian',
  'Peternakan',
  'Wisata',
  'Budaya',
  'Kerajinan',
  'Sumber Daya Alam',
  'Potensi lainnya',
];

const INITIAL_FORM: PotensiItem = {
  slug: '',
  title: '',
  category: 'Pertanian',
  description: '',
  image: '',
  lokasi: '',
  kontak: '',
};

export default function AdminPotensiDesaPage() {
  const [list, setList] = useState<PotensiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form
  const [formData, setFormData] = useState<PotensiItem>(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('potensi_desa')
      .select('*')
      .order('id', { ascending: false });

    if (data) setList(data as PotensiItem[]);
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: editingId ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalImageUrl = formData.image;

    // Jika pengguna memilih file baru dari perangkat, unggah ke Supabase Storage
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `potensi/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('potensi')
        .upload(filePath, selectedFile);

      if (uploadError) {
        alert('Gagal mengunggah gambar ke storage: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('potensi')
        .getPublicUrl(filePath);

      finalImageUrl = urlData.publicUrl;
    }

    const payload = {
      ...formData,
      image: finalImageUrl,
    };

    if (editingId) {
      const { error } = await supabase
        .from('potensi_desa')
        .update(payload)
        .eq('id', editingId);

      if (error) alert('Gagal memperbarui data: ' + error.message);
    } else {
      const { error } = await supabase.from('potensi_desa').insert([payload]);
      if (error) alert('Gagal menyimpan data: ' + error.message);
    }

    setUploading(false);
    closeModal();
    fetchData();
  };

  const handleEdit = (item: PotensiItem) => {
    setEditingId(item.id || null);
    setFormData(item);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data potensi desa ini?')) {
      await supabase.from('potensi_desa').delete().eq('id', id);
      fetchData();
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
              Manajemen Potensi Desa
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Tambah, perbarui, dan tampilkan berbagai komoditas unggulan, tempat wisata, hingga kebudayaan lokal desa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Tambah Potensi</span>
          </button>
        </div>

        {/* Tabel Data Potensi */}
        <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
              Daftar Potensi Desa
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total: {list.length} Data
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              Memuat data potensi desa...
            </div>
          ) : list.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-xs">
              Belum ada data potensi desa yang ditambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/60 font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 sm:px-6">Gambar</th>
                    <th className="p-4 sm:px-6">Judul / Potensi</th>
                    <th className="p-4 sm:px-6">Kategori</th>
                    <th className="p-4 sm:px-6">Lokasi & Kontak</th>
                    <th className="p-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:px-6">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <span className="material-symbols-outlined text-xl">
                                image
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <div className="font-bold text-slate-900 max-w-xs truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          /{item.slug}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6">
                        <span className="bg-emerald-50 text-[#064e3b] border border-emerald-100/80 font-bold px-2.5 py-1 rounded-lg text-[11px] uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-slate-600">
                        <div className="font-medium">{item.lokasi || '-'}</div>
                        {item.kontak && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            📞 {item.kontak}
                          </div>
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
                          onClick={() => handleDelete(item.id!)}
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

        {/* Modal Form Tambah/Edit Potensi */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200/60 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#064e3b]">
                    {editingId ? 'edit_note' : 'add_location_alt'}
                  </span>
                  <span>{editingId ? 'Edit Potensi Desa' : 'Tambah Potensi Desa'}</span>
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
                {/* Judul Potensi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Potensi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Wisata Embung Grogol"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slug (URL Slug)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="wisata-embung-grogol"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors font-mono"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kategori Potensi
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload File Gambar */}
                <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200/80">
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Upload Gambar dari Perangkat
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#043e2f] cursor-pointer"
                  />
                </div>

                {/* Direct Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Atau Input URL Gambar (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    disabled={!!selectedFile}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors disabled:opacity-50"
                  />
                  {selectedFile && (
                    <p className="text-[10px] text-amber-600 font-medium mt-1">
                      *Menggunakan gambar yang diunggah dari perangkat.
                    </p>
                  )}
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi Potensi
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Jelaskan secara singkat mengenai potensi desa ini..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* Lokasi & Kontak */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Lokasi (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Dusun Grogol"
                      value={formData.lokasi}
                      onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kontak / HP (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={formData.kontak}
                      onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                      className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                    />
                  </div>
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
                    <span>{uploading ? 'Menyimpan...' : 'Simpan Data'}</span>
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