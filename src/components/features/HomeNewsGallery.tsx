'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

interface HomeNewsGalleryProps {
  beritaList?: any[];
  galeriList?: any[];
}

// Helper mengekstrak thumbnail
function getGaleriImage(item: any): string {
  if (!item) return '/images/placeholder.jpg';


  const image =
    item.foto_url ||
    item.gambar_url ||
    item.cover_url ||
    item.media_url ||
    item.image_url ||
    item.mediaUrl ||
    item.imageUrl ||
    item.fotoUrl ||
    item.gambarUrl ||
    item.coverUrl ||
    item.url ||
    item.foto ||
    item.gambar;

  if (image && typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return image.startsWith('/') ? image : `/${image}`;
  }

  // Fallback if Video YouTube
  const ytUrl = item.youtube_url || item.youtubeUrl;
  if (ytUrl) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = ytUrl.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
  }

  return '/images/placeholder.jpg';
}

// Helper format
function safeFormatDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    return val.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  if (typeof val === 'string') {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime()) && val.includes('-')) {
      return parsed.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }
    return val;
  }
  return '';
}

export default function HomeNewsGallery({
  beritaList = [],
  galeriList = [],
}: HomeNewsGalleryProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: 'easeOut' } 
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative z-10 bg-background py-16 md:py-24 border-t border-surface-container/40"
    >
      <div className="max-w-container-max mx-auto w-full px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* NEWS COLUMN */}
        <div className="col-span-1 lg:col-span-7">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-headline-md text-headline-md text-on-surface mb-8 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-primary text-[32px]">
              newspaper
            </span>
            Berita Terkini
          </motion.h3>

          {beritaList.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              {beritaList.map((berita) => {
                const title = berita.judul || berita.title || 'Berita Desa';
                const image = getGaleriImage(berita);
                const snippet = berita.ringkasan || berita.deskripsi || berita.konten || '';
                const dateText = safeFormatDate(berita.tanggal || berita.createdAt || berita.created_at);

                return (
                  <motion.div key={berita.id} variants={itemVariants}>
                    <Link
                      href={`/berita/${berita.id}`}
                      className="group flex gap-6 items-start cursor-pointer border-b border-surface-container/60 pb-6"
                    >
                      <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-sm relative">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={title}
                          src={image}
                        />
                      </div>
                      <div>
                        {dateText && (
                          <span className="font-label-caps text-label-caps text-text-muted block mb-2">
                            {dateText}
                          </span>
                        )}
                        <h4 className="font-body-bold text-body-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {title}
                        </h4>
                        <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2 text-sm">
                          {snippet}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="py-8 text-center text-on-surface-variant bg-surface rounded-2xl border border-surface-container/50">
              Belum ada berita terbaru.
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 mt-8 font-body-bold text-body-bold text-primary hover:underline underline-offset-4 group"
            >
              Baca Berita Lainnya
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                east
              </span>
            </Link>
          </motion.div>
        </div>

        {/* GALLERY COLUMN */}
        <div className="col-span-1 lg:col-span-5">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-headline-md text-headline-md text-on-surface mb-8 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-primary text-[32px]">
              photo_library
            </span>
            Galeri Desa
          </motion.h3>

          {galeriList.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {galeriList.slice(0, 4).map((item) => {
                const title = item.title || item.judul || item.caption || 'Foto Galeri';
                const image = getGaleriImage(item);

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm relative group cursor-pointer border border-surface-container-high/30"
                  >
                    <Link href="/galeri" className="block w-full h-full">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={title}
                        src={image}
                      />
                      <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                        <span className="material-symbols-outlined text-white text-[32px]">
                          visibility
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="py-16 text-center text-on-surface-variant bg-surface rounded-2xl border border-surface-container/50">
              Belum ada foto di galeri.
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/galeri"
              className="inline-block mt-6 font-body-bold text-body-bold text-primary hover:text-on-primary w-full text-center py-3.5 bg-surface-container-high rounded-xl hover:bg-primary transition-all duration-300 shadow-xs"
            >
              Lihat Semua Foto
            </Link>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}