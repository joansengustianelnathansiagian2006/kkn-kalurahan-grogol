'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TambahUMKMPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    nama: '',
    dusun: 'Dusun Grogol',
    kategori: 'Kuliner',
    whatsapp: '',
    deskripsi: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let fotoUrl = '';

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('kkn-media')
          .upload(`umkm/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('kkn-media')
          .getPublicUrl(`umkm/${fileName}`);

        fotoUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('umkm').insert([
        {
          nama: form.nama,
          dusun: form.dusun,
          kategori: form.kategori,
          whatsapp: form.whatsapp,
          deskripsi: form.deskripsi,
          foto_url: fotoUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert('Berhasil menambah UMKM!');
      router.push('/admin/umkm');
    } catch (err: any) {
      alert(`Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <h1 className="text-xl font-bold text-slate-800 mb-4">Tambah UMKM Baru</h1>

        <div>
          <label className="block text-sm font-medium mb-1">Nama Usaha / UMKM</label>
          <input
            type="text"
            required
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="Contoh: Keripik Pisang Ibu Ana"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Kuliner">Kuliner</option>
              <option value="Kerajinan">Kerajinan</option>
              <option value="Pertanian">Pertanian</option>
              <option value="Jasa">Jasa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dusun / Padukuhan</label>
            <input
              type="text"
              required
              value={form.dusun}
              onChange={(e) => setForm({ ...form, dusun: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="Contoh: 081234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Foto Produksi/Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-1 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
          <textarea
            rows={4}
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full p-2 border rounded-lg"
            placeholder="Penjelasan singkat mengenai produk..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Menyimpan...' : 'Simpan UMKM'}
          </button>
        </div>
      </form>
    </div>
  );
}