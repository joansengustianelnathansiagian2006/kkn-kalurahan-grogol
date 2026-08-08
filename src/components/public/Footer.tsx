// src/components/public/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-200 pt-20 pb-10 px-4 md:px-8 overflow-hidden">
      {/* WATERMARK TEXT BACKGROUND  */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
        <span className="text-[11vw] font-black uppercase tracking-tighter text-white/[0.03] leading-none block">
          KALURAHAN GROGOL
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* FLOATING CARD DENGAN BINGKAI MACBOOK WINDOW */}
        <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
          
          {/* HEADER CARD */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-100 dark:border-slate-800">
            {/* Control Dots MacBook */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500/90 inline-block shadow-sm" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500/90 inline-block shadow-sm" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 inline-block shadow-sm" />
              </div>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  G
                </div>
                <span className="text-xs font-bold tracking-tight text-slate-700 dark:text-slate-300">
                  Kalurahan Grogol — Sobat Desa
                </span>
              </div>
            </div>

            {/* Social Media Pill Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* GRID UTAMA NAVIGATION LINKS + CTA BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
            
            {/* NAVIGASI SUB-MENU (8 KOLOM) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Kolom 1: Profil */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                  Profil Desa
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <li>
                    <Link href="/profil#sejarah" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Sejarah Desa
                    </Link>
                  </li>
                  <li>
                    <Link href="/profil#visi-misi" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Visi & Misi
                    </Link>
                  </li>
                  <li>
                    <Link href="/profil#struktur" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Struktur Organisasi
                    </Link>
                  </li>
                  <li>
                    <Link href="/profil#geografis" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Kondisi Geografis
                    </Link>
                  </li>
                  <li>
                    <Link href="/profil#padukuhan" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Padukuhan
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Kolom 2: Jelajah Desa */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                  Jelajah Desa
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <li>
                    <Link href="/program-kerja" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Program Kerja
                    </Link>
                  </li>
                  <li>
                    <Link href="/umkm" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Produk UMKM
                    </Link>
                  </li>
                  <li>
                    <Link href="/potensi-desa" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Potensi Desa
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Kolom 3: Informasi & Layanan */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                  Informasi & Pusat
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <li>
                    <Link href="/berita" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Berita Desa
                    </Link>
                  </li>
                  <li>
                    <Link href="/galeri" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Galeri Dokumentasi
                    </Link>
                  </li>
                  <li>
                    <Link href="/download-center" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Download Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/kontak" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      Kontak & Lokasi
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            {/* HIGHLIGHT CTA BLOCK  */}
            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between h-full min-h-[220px]">
                
                {/* Visual Accent Circle */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase mb-3 border border-emerald-500/30">
                    Sobat Desa Kalurahan
                  </span>
                  <h4 className="text-xl font-black text-white leading-tight">
                    Pusat Informasi & Pelayanan Digital
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Akses kemudahan dokumen, berita terkini, serta potensi UMKM Kalurahan Grogol dalam satu pintu.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 relative z-10">
                  <Link
                    href="/kontak"
                    className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20"
                  >
                    Hubungi Kami
                  </Link>
                  <Link
                    href="/download-center"
                    className="text-center bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors backdrop-blur-md"
                  >
                    Unduh Berkas
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER BOTTOM BAR / COPYRIGHT */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-700 dark:text-slate-200">Kalurahan Grogol</span>. All rights reserved.
            </p>
            <p className="text-center sm:text-right font-medium text-slate-400">
              Dikembangkan oleh <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tim KKN Kalurahan Grogol</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}