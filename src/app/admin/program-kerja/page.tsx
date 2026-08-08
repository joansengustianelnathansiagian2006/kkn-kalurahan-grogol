'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProkerItem {
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

export default function AdminProkerPage() {
  const [prokerList, setProkerList] = useState<ProkerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<ProkerItem | null>(null);

  // State Slug
  const [slug, setSlug] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    tanggal: '',
    lokasi: '',
    latar_belakang: '',
    tujuan: '',
    pelaksanaan: '',
    hasil: '',
    manfaat: '',
    dokumentasi_video: '',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [digitalFile, setDigitalFile] = useState<File | null>(null);

  const fetchProker = async () => {
    const { data } = await supabase.from('proker').select('*').order('created_at', { ascending: false });
    if (data) setProkerList(data);
  };

  useEffect(() => {
    fetchProker();
  }, []);

  // Auto-generate slug dari nama program
  const handleNamaChange = (val: string) => {
    setFormData({ ...formData, nama: val });
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
  };

  // Upload file umum (Cover & File Digital) ke bucket 'proker'
  const uploadFileToProker = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const path = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('proker').upload(path, file);
    if (uploadError) throw new Error(`Upload storage gagal: ${uploadError.message}`);

    const { data } = supabase.storage.from('proker').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCoverUrl = editingItem?.cover_url || '';
      let finalFileUrl = editingItem?.file_url || '';
      const currentDocFotoUrls = editingItem?.dokumentasi_foto || [];

      // 1. Upload Cover & File Digital
      if (coverFile) {
        finalCoverUrl = await uploadFileToProker(coverFile, 'cover');
      }

      if (digitalFile) {
        finalFileUrl = await uploadFileToProker(digitalFile, 'files');
      }

      const calculatedSlug = slug || formData.nama.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
      let prokerId = editingItem?.id;

      const payload = {
        ...formData,
        slug: calculatedSlug,
        cover_url: finalCoverUrl || null,
        file_url: finalFileUrl || null,
        dokumentasi_foto: currentDocFotoUrls,
      };

      // 2. Simpan/Update Record Proker
      if (editingItem && prokerId) {
        const { error } = await supabase.from('proker').update(payload).eq('id', prokerId);
        if (error) throw error;
      } else {
        const { data: newProker, error } = await supabase
          .from('proker')
          .insert([payload])
          .select('id')
          .single();
        if (error) throw error;
        prokerId = newProker.id;
      }

      // 3. Jika ada Dokumentasi Foto: Upload ke Bucket 'galeri' & Simpan ke Tabel 'galeri'
      if (docFiles.length > 0 && prokerId) {
        const newUploadedUrls: string[] = [];

        for (const file of docFiles) {
          const ext = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
          const filePath = `proker/${fileName}`;

          // Upload ke Bucket Storage 'galeri'
          const { error: uploadErr } = await supabase.storage.from('galeri').upload(filePath, file);
          if (uploadErr) throw new Error(`Upload ke galeri gagal: ${uploadErr.message}`);

          // Ambil Public URL
          const { data: urlData } = supabase.storage.from('galeri').getPublicUrl(filePath);
          const publicUrl = urlData.publicUrl;

          newUploadedUrls.push(publicUrl);

          // Insert ke Tabel Database 'galeri' terhubung dengan proker_id
          await supabase.from('galeri').insert([
            {
              judul: `Dokumentasi ${formData.nama}`,
              foto_url: publicUrl,
              proker_id: prokerId,
            },
          ]);
        }

        // Update list dokumentasi_foto di tabel proker
        const updatedDocUrls = [...currentDocFotoUrls, ...newUploadedUrls];
        await supabase
          .from('proker')
          .update({ dokumentasi_foto: updatedDocUrls })
          .eq('id', prokerId);
      }

      alert(editingItem ? 'Program kerja berhasil diperbarui!' : 'Program kerja berhasil ditambahkan!');
      resetForm();
      fetchProker();
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ProkerItem) => {
    setEditingItem(item);
    setSlug(item.slug || '');
    setFormData({
      nama: item.nama || '',
      kategori: item.kategori || '',
      tanggal: item.tanggal || '',
      lokasi: item.lokasi || '',
      latar_belakang: item.latar_belakang || '',
      tujuan: item.tujuan || '',
      pelaksanaan: item.pelaksanaan || '',
      hasil: item.hasil || '',
      manfaat: item.manfaat || '',
      dokumentasi_video: item.dokumentasi_video || '',
    });
    setCoverFile(null);
    setDocFiles([]);
    setDigitalFile(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus program kerja ini?')) {
      const { error } = await supabase.from('proker').delete().eq('id', id);
      if (error) {
        alert(`Gagal menghapus: ${error.message}`);
      } else {
        fetchProker();
      }
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setSlug('');
    setFormData({
      nama: '',
      kategori: '',
      tanggal: '',
      lokasi: '',
      latar_belakang: '',
      tujuan: '',
      pelaksanaan: '',
      hasil: '',
      manfaat: '',
      dokumentasi_video: '',
    });
    setCoverFile(null);
    setDocFiles([]);
    setDigitalFile(null);
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
              Manajemen Program Kerja
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Kelola data seluruh program kerja desa, upload dokumen pendukung, foto dokumentasi, dan tautan video kegiatan.
            </p>
          </div>
          {editingItem && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all self-start md:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        {/* Form Input Proker */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-[#064e3b]">
                {editingItem ? 'edit_note' : 'add_circle'}
              </span>
              <span>{editingItem ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}</span>
            </h2>
            {editingItem && (
              <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-200">
                Mode Edit Data
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Program
              </label>
              <input
                type="text"
                placeholder="Masukkan nama program kerja..."
                required
                value={formData.nama}
                onChange={(e) => handleNamaChange(e.target.value)}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Slug URL (Otomatis)
              </label>
              <input
                type="text"
                placeholder="slug-otomatis"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-100/70 border border-slate-200 rounded-xl p-3 text-xs font-mono text-emerald-700 focus:outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori
              </label>
              <input
                type="text"
                placeholder="Contoh: Kesehatan, Pendidikan, Infrastruktur..."
                required
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Pelaksanaan
              </label>
              <input
                type="text"
                placeholder="Contoh: 15 Juli 2026"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lokasi Pelaksanaan
              </label>
              <input
                type="text"
                placeholder="Lokasi spesifik kegiatan..."
                required
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Latar Belakang
              </label>
              <textarea
                rows={3}
                placeholder="Latar belakang kegiatan..."
                value={formData.latar_belakang}
                onChange={(e) => setFormData({ ...formData, latar_belakang: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tujuan Program
              </label>
              <textarea
                rows={3}
                placeholder="Tujuan kegiatan..."
                value={formData.tujuan}
                onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pelaksanaan
              </label>
              <textarea
                rows={3}
                placeholder="Uraian alur atau ringkasan pelaksanaan..."
                value={formData.pelaksanaan}
                onChange={(e) => setFormData({ ...formData, pelaksanaan: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hasil yang Dicapai
              </label>
              <textarea
                rows={3}
                placeholder="Hasil yang dicapai dari kegiatan..."
                value={formData.hasil}
                onChange={(e) => setFormData({ ...formData, hasil: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manfaat Kegiatan
              </label>
              <textarea
                rows={3}
                placeholder="Manfaat bagi masyarakat/desa..."
                value={formData.manfaat}
                onChange={(e) => setFormData({ ...formData, manfaat: e.target.value })}
                className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Section Upload Files */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#f8faf9] p-5 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Foto Cover {editingItem && <span className="text-[10px] font-normal text-slate-500">(Opsional/Ubah)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#043e2f] cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Dokumentasi Foto {editingItem && <span className="text-[10px] font-normal text-slate-500">(Tambah Foto)</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setDocFiles(Array.from(e.target.files || []))}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#043e2f] cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                File Digital {editingItem && <span className="text-[10px] font-normal text-slate-500">(Opsional/Ubah)</span>}
              </label>
              <input
                type="file"
                onChange={(e) => setDigitalFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#064e3b] file:text-white hover:file:bg-[#043e2f] cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tautan Video (YouTube / Google Drive)
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=... atau link Drive"
              value={formData.dokumentasi_video}
              onChange={(e) => setFormData({ ...formData, dokumentasi_video: e.target.value })}
              className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end">
            {editingItem && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-200 text-slate-700 font-bold text-xs uppercase px-6 py-3.5 rounded-2xl hover:bg-slate-300 transition-all cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-7 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>{loading ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah Proker'}</span>
            </button>
          </div>
        </form>

        {/* Tabel Data Proker */}
        <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Daftar Program Kerja</h3>
            <span className="text-xs text-slate-500 font-medium">Total: {prokerList.length} Program</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/60 font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 sm:px-6">Nama Program</th>
                  <th className="p-4 sm:px-6">Slug</th>
                  <th className="p-4 sm:px-6">Kategori</th>
                  <th className="p-4 sm:px-6">Tanggal</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prokerList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                      Belum ada data program kerja.
                    </td>
                  </tr>
                ) : (
                  prokerList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:px-6 font-bold text-slate-900">{item.nama}</td>
                      <td className="p-4 sm:px-6 text-emerald-700 font-mono text-[11px] font-medium">
                        {item.slug || '-'}
                      </td>
                      <td className="p-4 sm:px-6">
                        <span className="bg-emerald-50 text-[#064e3b] font-bold px-2.5 py-1 rounded-lg border border-emerald-100/80 text-[11px]">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4 sm:px-6 text-slate-600 font-medium">{item.tanggal}</td>
                      <td className="p-4 sm:px-6 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}