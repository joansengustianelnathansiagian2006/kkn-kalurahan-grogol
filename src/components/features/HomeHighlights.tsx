'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

interface HomeHighlightsProps {
  umkmList?: any[];
  projaList?: any[];
}

// Helper mengekstrak gambar
function getHighlightImage(item: any): string {
  if (!item) return '/images/placeholder.jpg';

  const img =
    item.foto_url ||
    item.gambar_url ||
    item.cover_url ||
    item.logo_url ||
    item.image_url ||
    item.media_url ||
    item.foto_cover ||
    item.fotoCover ||
    item.logo ||
    item.imageUrl ||
    item.mediaUrl ||
    item.fotoUrl ||
    item.gambarUrl ||
    item.coverUrl ||
    item.foto ||
    item.gambar ||
    item.url;

  if (img && typeof img === 'string') {
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  }

  return '/images/placeholder.jpg';
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function HomeHighlights({
  umkmList = [],
  projaList = [],
}: HomeHighlightsProps) {
  return (
    <section className="relative z-10 bg-transparent pt-16 pb-20 border-t border-surface-container-high/40 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        
        {/* UMKM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <span className="font-label-caps text-label-caps text-category-econ uppercase tracking-widest mb-2 block">
              Ekonomi Lokal
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Produk Unggulan UMKM
            </h3>
          </div>
          
          <Link
            href="/umkm"
            className="hidden md:inline-flex items-center gap-2 font-body-bold text-body-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
          >
            Lihat Semua
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {umkmList.length > 0 ? (
            umkmList.map((item) => {
              const title = item.namaUmkm || item.nama_umkm || item.nama || item.title || 'UMKM';
              const image = getHighlightImage(item);
              const description = item.deskripsi || item.produk || '';

              return (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link
                    href={`/umkm/${item.id}`}
                    className="group bg-surface rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer border border-surface-container/50 hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={title}
                        src={image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute top-4 left-4 bg-category-econ text-on-primary px-3 py-1 rounded-full font-label-caps text-label-caps shadow-xs">
                        UMKM
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow bg-surface relative">
                      <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h4>
                      <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2">
                        {description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-on-surface-variant">
              Belum ada data UMKM.
            </div>
          )}
        </motion.div>

        {/* PROGRAM KERJA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-end mb-10 pt-4"
        >
          <div>
            <span className="font-label-caps text-label-caps text-category-soc uppercase tracking-widest mb-2 block">
              Pembangunan Berkelanjutan
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Program Kerja Terbaru
            </h3>
          </div>
          
          <Link
            href="/program-kerja"
            className="hidden md:inline-flex items-center gap-2 font-body-bold text-body-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
          >
            Lihat Semua
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col gap-6"
        >
          {projaList.length > 0 ? (
            projaList.map((proja) => {
              const title = proja.namaProgram || proja.nama_program || proja.nama || proja.title || 'Program Kerja';
              const image = getHighlightImage(proja);
              const category = proja.kategori || proja.cluster || 'Program';
              const description = proja.latarBelakang || proja.latar_belakang || proja.deskripsi || proja.tujuan || '';

              return (
                <motion.div key={proja.id} variants={itemVariants}>
                  <Link
                    href={`/program-kerja/${proja.id}`}
                    className="bg-surface rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-center group cursor-pointer border border-surface-container/50 hover:-translate-y-1"
                  >
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative bg-surface-dim">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={title}
                        src={image}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container rounded-md font-label-caps text-[10px] uppercase font-bold">
                          {category}
                        </span>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h4>
                      <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2">
                        {description}
                      </p>
                    </div>
                    <div className="shrink-0 p-4 bg-surface-container rounded-full group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 text-on-surface-variant group-hover:rotate-45">
                      <span className="material-symbols-outlined">arrow_outward</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              Belum ada data Program Kerja.
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}