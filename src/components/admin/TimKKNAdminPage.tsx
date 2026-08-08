'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  cluster: string;
  department: string;
  nim: string;
  imageUrl: string;
  isLeadership: boolean;
}

const ROLE_OPTIONS = [
  'Dosen Pembimbing Lapangan',
  'Koordinator Unit (Kormanit)',
  'Sekretaris',
  'Bendahara',
  'Kormater Medika',
  'Kormater Agro',
  'Kormater SAINTEK',
  'Kormater SOSHUM',
  'Anggota Sub-Unit',
];

const CLUSTER_OPTIONS = ['SOSHUM', 'SAINTEK', 'MEDIKA', 'AGRO'];

export default function TimKKNAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: 'Anggota Sub-Unit',
    cluster: 'SOSHUM',
    department: '',
    nim: '',
    imageUrl: '',
    isLeadership: false,
  });

  // 1. Fetch Data dari Supabase saat Komponen Dimuat
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Gagal mengambil data tim:', error.message);
    } else if (data) {
      const formattedData: TeamMember[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        cluster: item.cluster,
        department: item.department,
        nim: item.nim,
        imageUrl: item.image_url || '',
        isLeadership: item.is_leadership || false,
      }));
      setTeam(formattedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // 2. Mengatur Buka Modal
  const handleOpenModal = (member?: TeamMember) => {
    setSelectedFile(null);
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        cluster: member.cluster,
        department: member.department,
        nim: member.nim,
        imageUrl: member.imageUrl,
        isLeadership: member.isLeadership,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: 'Anggota Sub-Unit',
        cluster: 'SOSHUM',
        department: '',
        nim: '',
        imageUrl: '',
        isLeadership: false,
      });
    }
    setIsModalOpen(true);
  };

  // 3. Handle Pilihan File Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: previewUrl });
    }
  };

  // 4. Helper Function Upload Gambar ke Storage
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('team-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('team-photos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // 5. Simpan Data (Create & Update) ke Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // Jika ada file lokal yang dipilih, unggah ke Supabase Storage terlebih dahulu
      if (selectedFile) {
        finalImageUrl = await uploadImageToSupabase(selectedFile);
      }

      const payload = {
        name: formData.name,
        role: formData.role,
        cluster: formData.cluster,
        department: formData.department,
        nim: formData.nim,
        image_url: finalImageUrl,
        is_leadership: formData.isLeadership,
      };

      if (editingMember) {
        // Update
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingMember.id);

        if (error) throw error;
      } else {
        // Create Baru
        const { error } = await supabase
          .from('team_members')
          .insert([payload]);

        if (error) throw error;
      }

      await fetchTeamMembers();
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Hapus Data dari Supabase
  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus anggota tim ini?')) {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Gagal menghapus data: ' + error.message);
      } else {
        setTeam(team.filter((m) => m.id !== id));
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Tim KKN</h1>
          <p className="text-sm text-slate-500">
            Tambah, ubah foto, NIM, peran, dan informasi anggota Tim KKN-PPM.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Anggota
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        /* Grid Kartu Anggota */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative group"
            >
              <div>
                {/* Foto Profile Preview */}
                <div className="w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center border border-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[64px] text-slate-300">
                      person
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {item.cluster || 'N/A'}
                  </span>
                </div>

                {/* Detail Informasi */}
                <div className="text-center">
                  <h3 className="font-bold text-slate-800 text-lg leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.department || 'Departemen'} {item.nim ? `/ ${item.nim}` : ''}
                  </p>

                  {/* Role Pill Badge */}
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-xs">
                      {item.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi (Edit & Hapus) */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium text-xs rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  title="Hapus Anggota"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingMember ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Preview & Input Foto */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300 text-3xl">
                        person
                      </span>
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Atau masukkan URL Foto..."
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Rina Wijaya"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Opsi Role / Jabatan Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Peran / Jabatan (Role)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Kluster */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Kluster
                  </label>
                  <select
                    value={formData.cluster}
                    onChange={(e) =>
                      setFormData({ ...formData, cluster: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {CLUSTER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input NIM */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    NIM
                  </label>
                  <input
                    type="text"
                    placeholder="20/456789/PS/21345"
                    value={formData.nim}
                    onChange={(e) =>
                      setFormData({ ...formData, nim: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Program Studi / Fakultas */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Program Studi / Fakultas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Psikologi"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Status Leadership */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isLeadership"
                  checked={formData.isLeadership}
                  onChange={(e) =>
                    setFormData({ ...formData, isLeadership: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="isLeadership" className="text-xs text-slate-700 font-medium">
                  Tampilkan di bagian pimpinan atas (DPL / Kormanit)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}