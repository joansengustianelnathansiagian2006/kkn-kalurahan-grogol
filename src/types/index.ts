// src/types/index.ts

export type ProgramKerja = {
  id: string;
  fotoCover: string;
  namaProgram: string;
  kategori: string;
  tanggalPelaksanaan: Date;
  lokasi: string;
  latarBelakang: string;
  tujuan: string;
  pelaksanaan: string;
  hasil: string;
  manfaat: string;
  dokumentasiFoto: string[];
  dokumentasiVideo: string | null;
  fileDigital: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Umkm = {
  id: string;
  logo: string;
  namaUmkm: string;
  deskripsi: string;
  produk: string;
  alamat: string;
  lokasiMap: string;
  nomorWhatsApp: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PotensiDesaKategori = 
  | 'Pertanian'
  | 'Peternakan'
  | 'Wisata'
  | 'Budaya'
  | 'Kerajinan'
  | 'Sumber Daya Alam'
  | string;

export type PotensiDesa = {
  id: string;
  kategori: PotensiDesaKategori;
  namaPotensi: string;
  deskripsi: string;
  fotoCover: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GaleriTipe = 'Foto' | 'Video';

export type Galeri = {
  id: string;
  tipe: GaleriTipe;
  url: string;
  judul: string | null;
  kategori: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Artikel = {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  fotoCover: string;
  penulis: string;
  tanggal: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type DownloadCenterKategori = 
  | 'Modul'
  | 'Poster'
  | 'Leaflet'
  | 'Buku Panduan'
  | 'Laporan'
  | 'Dokumen lainnya'
  | string;

export type DownloadCenter = {
  id: string;
  judul: string;
  kategori: DownloadCenterKategori;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Kontak = {
  id: string;
  alamat: string;
  googleMaps: string;
  email: string;
  nomorWhatsApp: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminRole = 'ADMIN' | 'SUPERADMIN' | string;

export type Admin = {
  id: string;
  username: string;
  nama: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
  // Note: Password omitted intentionally for safety in frontend types
};
