'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface GaleriItem {
  id: number;
  title: string;
  type: 'foto' | 'video';
  media_url?: string;
  youtube_url?: string;
  description?: string;
  created_at: string;
}

const INITIAL_FORM = {
  title: '',
  type: 'foto' as 'foto' | 'video',
  media_url: '',
  youtube_url: '',
  description: '',
};

export default function AdminGaleriPage() {
  const [list, setList] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Form
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('galeri')
      .select('*')
      .order('id', { ascending: false });

    if (data) setList(data as GaleriItem[]);
    setLoading(false);
  };

  // Handler Submit Form & Upload File
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalMediaUrl = formData.media_url;

    // Jika user memilih file dari device, upload dulu ke Supabase Storage
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${formData.type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('galeri')
        .upload(filePath, selectedFile);

      if (uploadError) {
        alert('Gagal mengunggah file ke storage: ' + uploadError.message);
        setUploading(false);
        return;
      }

      // Ambil Public URL file yang baru diupload
      const { data: urlData } = supabase.storage
        .from('galeri')
        .getPublicUrl(filePath);

      finalMediaUrl = urlData.publicUrl;
    }

    // Simpan data ke tabel database `galeri`
    const payload = {
      title: formData.title,
      type: formData.type,
      media_url: finalMediaUrl || null,
      youtube_url: formData.youtube_url || null,
      description: formData.description || null,
    };

    const { error: dbError } = await supabase.from('galeri').insert([payload]);

    if (!dbError) {
      closeModal();
      fetchData();
    } else {
      alert('Gagal menyimpan galeri: ' + dbError.message);
    }

    setUploading(false);
  };

  const handleDelete = async (item: GaleriItem) => {
    if (confirm('Yakin ingin menghapus item galeri ini?')) {
      await supabase.from('galeri').delete().eq('id', item.id);
      fetchData();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
              Manajemen Galeri Kegiatan
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Unggah, kelola, dan publikasikan koleksi foto serta video dokumentasi seluruh program kegiatan desa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Tambah Galeri</span>
          </button>
        </div>

        {/* Tabel Data Galeri */}
        <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Daftar Item Galeri</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {list.length} Media</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-medium">
              Memuat data galeri...
            </div>
          ) : list.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-xs">
              Belum ada item galeri yang ditambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/60 font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4 sm:px-6">Media</th>
                    <th className="p-4 sm:px-6">Judul Kegiatan</th>
                    <th className="p-4 sm:px-6">Tipe</th>
                    <th className="p-4 sm:px-6">Link YouTube</th>
                    <th className="p-4 sm:px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:px-6">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                          {item.media_url ? (
                            <Image
                              src={item.media_url}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                              <span className="material-symbols-outlined text-xl">
                                {item.type === 'video' ? 'play_circle' : 'image'}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:px-6 font-bold text-slate-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="p-4 sm:px-6">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-lg border text-[11px] uppercase ${
                            item.type === 'video'
                              ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                              : 'bg-emerald-50 text-[#064e3b] border-emerald-100/80'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-slate-500 max-w-xs truncate">
                        {item.youtube_url ? (
                          <a
                            href={item.youtube_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#064e3b] hover:underline font-mono text-[11px]"
                          >
                            {item.youtube_url}
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="p-4 sm:px-6 text-right">
                        <button
                          onClick={() => handleDelete(item)}
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

        {/* Modal Tambah Galeri */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200/60 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#064e3b]">add_photo_alternate</span>
                  <span>Tambah Item Galeri</span>
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
                {/* Tipe Galeri */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipe Galeri
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'foto' })}
                      className={`py-2.5 rounded-xl font-bold border text-xs transition-all cursor-pointer ${
                        formData.type === 'foto'
                          ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-sm'
                          : 'bg-[#f8faf9] text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'video' })}
                      className={`py-2.5 rounded-xl font-bold border text-xs transition-all cursor-pointer ${
                        formData.type === 'video'
                          ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-sm'
                          : 'bg-[#f8faf9] text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                {/* Judul */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Dokumen / Kegiatan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kerja Bakti Dusun Grogol"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* UPLOAD FILE DARI DEVICE */}
                <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-200/80">
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Upload File dari Device
                  </label>
                  <input
                    type="file"
                    accept={formData.type === 'foto' ? 'image/*' : 'video/*,image/*'}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#043e2f] cursor-pointer"
                  />
                </div>

                {/* OPSI URL GAMBAR / MEDIA (OPSIONAL) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Atau Input URL Media (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.media_url}
                    disabled={!!selectedFile}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors disabled:opacity-50"
                  />
                  {selectedFile && (
                    <p className="text-[10px] text-amber-600 font-medium mt-1">
                      *Menggunakan file yang diunggah dari device.
                    </p>
                  )}
                </div>

                {/* LINK YOUTUBE */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Link YouTube (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* DESKRIPSI */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Deskripsi / Keterangan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Keterangan singkat..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                {/* ACTION BUTTONS */}
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
                    <span>{uploading ? 'Mengunggah...' : 'Simpan Galeri'}</span>
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