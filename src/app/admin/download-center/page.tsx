'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface DownloadItem {
  id: string;
  judul: string;
  kategori: string;
  deskripsi: string;
  file_url: string;
  file_size: string;
  download_count: number;
  created_at: string;
}

const KATEGORI_LIST = [
  'Modul',
  'Poster',
  'Leaflet',
  'Buku Panduan',
  'Laporan',
  'Dokumen lainnya',
];

export default function AdminDownloadCenter() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState(KATEGORI_LIST[0]);
  const [deskripsi, setDeskripsi] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setItems(data);
    setLoading(false);
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !judul.trim()) {
      alert('Judul dan file dokumen wajib diisi.');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload File ke Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('download-center')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Ambil Public URL
      const { data: publicUrlData } = supabase.storage
        .from('download-center')
        .getPublicUrl(filePath);

      const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      // 3. Simpan Metadata ke Tabel downloads
      const { error: dbError } = await supabase.from('downloads').insert([
        {
          judul,
          kategori,
          deskripsi,
          file_url: publicUrlData.publicUrl,
          file_size: fileSizeFormatted,
        },
      ]);

      if (dbError) throw dbError;

      alert('Berkas berhasil diunggah!');
      resetForm();
      fetchItems();
    } catch (err: any) {
      alert(`Gagal mengunggah: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berkas ini?')) return;

    try {
      // Hapus data dari database
      await supabase.from('downloads').delete().eq('id', id);

      // Hapus file dari Supabase Storage jika merupakan URL internal
      if (fileUrl.includes('download-center')) {
        const path = fileUrl.split('download-center/')[1];
        if (path) await supabase.storage.from('download-center').remove([path]);
      }

      fetchItems();
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const resetForm = () => {
    setJudul('');
    setKategori(KATEGORI_LIST[0]);
    setDeskripsi('');
    setFile(null);
    setIsModalOpen(false);
  };

  const filteredItems = items.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase())
  );

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
              Kelola Download Center
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              Manajemen berkas publik seperti Modul, Poster, Leaflet, Buku Panduan, dan Laporan KKN.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold text-xs uppercase px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Tambah Berkas Baru</span>
          </button>
        </div>

        {/* Bar Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Cari judul atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] shadow-sm transition-colors"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500 self-end sm:self-auto">
            Total Berkas: <span className="text-slate-900 font-bold">{filteredItems.length}</span>
          </div>
        </div>

        {/* Tabel Data Berkas */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-4 pl-6">#</th>
                  <th className="p-4">Judul Dokumen</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Ukuran File</th>
                  <th className="p-4">Total Unduhan</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[#064e3b]">
                          progress_activity
                        </span>
                        <span>Memuat data berkas...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-400 font-medium">
                      Belum ada berkas yang diunggah.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6 font-mono text-slate-400">{index + 1}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{item.judul}</div>
                        {item.deskripsi && (
                          <p className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">
                            {item.deskripsi}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#064e3b] border border-emerald-200/60">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{item.file_size || '-'}</td>
                      <td className="p-4 font-mono text-slate-500">{item.download_count || 0}x</td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-[#064e3b] hover:bg-emerald-50 rounded-xl transition-colors"
                            title="Pratinjau File"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </a>
                          <button
                            onClick={() => handleDelete(item.id, item.file_url)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Hapus Berkas"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
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

        {/* Modal Form Unggah Berkas */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-slate-800">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                    Unggah Berkas Baru
                  </h2>
                  <p className="text-[11px] text-slate-500">Isi data dan pilih dokumen yang ingin dipublikasi</p>
                </div>
                <button
                  onClick={resetForm}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <form onSubmit={handleUploadAndSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Judul Dokumen *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Modul Pengolahan Sampah Organik"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors"
                  >
                    {KATEGORI_LIST.map((kat) => (
                      <option key={kat} value={kat}>
                        {kat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Penjelasan singkat konten file..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Pilih File (PDF/Image/Doc/Zip) *
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#f8faf9] border border-slate-200 rounded-xl p-2.5 text-slate-500 focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-[#064e3b] file:font-bold file:text-xs hover:file:bg-emerald-100 transition-all cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2.5 bg-[#064e3b] hover:bg-[#043e2f] text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-sm"
                  >
                    {uploading ? 'Mengunggah...' : 'Simpan & Unggah'}
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