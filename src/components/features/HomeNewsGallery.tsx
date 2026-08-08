'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export default function HomeNewsGallery() {
  //  tipe Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  //  tipe Variants 
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
      // Hapus `-mt-10`
      className="relative z-10 bg-background py-16 md:py-24 border-t border-surface-container/40"
    >
      <div className="max-w-container-max mx-auto w-full px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/*  NEWS COLUMN  */}
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            {/* News Item 1 */}
            <motion.div variants={itemVariants}>
              <Link
                href="/berita"
                className="group flex gap-6 items-start cursor-pointer border-b border-surface-container/60 pb-6"
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-sm relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Musrenbang"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9MuCd5hD9C923iZfX09urIhvbvi92D39Ih9jhShmWYsyN2kP0rjKA_Qew8yeIxL6wAR-FgpPbKvPRemR2tiKHeP090Xmefrtam1eGsCEAiQ5HlqB4IYtReiK39yNUrkKPxTEWkwSxoh3p_nd6Qq2zOf87mVL4aPg5LGFLiJKfK2ETQnKNnRb0ermFJIa2YYBW2-VrndPGFqwt-fBwh1-5TkdREi16J8WpPtfRPr30YuJzH0-msx93nw"
                  />
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-text-muted block mb-2">
                    12 Oktober 2023
                  </span>
                  <h4 className="font-body-bold text-body-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    Musyawarah Perencanaan Pembangunan (Musrenbang) Desa Tahun
                    2024 Berlangsung Sukses
                  </h4>
                  <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2 text-sm">
                    Partisipasi warga sangat tinggi dalam menentukan arah
                    pembangunan desa untuk tahun anggaran mendatang...
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* News Item 2 */}
            <motion.div variants={itemVariants}>
              <Link
                href="/berita"
                className="group flex gap-6 items-start cursor-pointer border-b border-surface-container/60 pb-6"
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container shadow-sm relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Panen Raya"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOs78k0HZgLUcv5mpSVv_PFAxFYmfkChh10e-XJLfJIQT2xILnqenapw_Nqt_HTGDKF2h_HAESPrO4rAUHKjRmLQewJgE5huAbaJsqtVN7wIqHD4UM18OV3BSQN7TgUrbD1g-SD4G6HTPb_3PqnFXOPg3TY4Itr_x2bkwPnvnJ4fJRXPaxgC5WVyqY7B1LPhtOERKJNcggvXdJMmWtNNBBXPcWwRyaevZlGnoEwlQC9pxbvn6-1AfrGA"
                  />
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-text-muted block mb-2">
                    08 Oktober 2023
                  </span>
                  <h4 className="font-body-bold text-body-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    Panen Raya Kelompok Tani Makmur Mencapai Target Optimal
                  </h4>
                  <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2 text-sm">
                    Berkat penerapan metode pertanian organik, hasil panen padi
                    tahun ini mengalami peningkatan signifikan...
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

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

        {/*  GALLERY COLUMN  */}
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Gallery Item 1 */}
            <motion.div
              variants={itemVariants}
              className="aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm relative group cursor-pointer border border-surface-container-high/30"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt="Gallery 1"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz6Cue8W-bWYQDEVBxitWv3qfAHDXoDTy79I2GtEfFtAJJ9hhhSbxKzR6oEUvHvA-0qJSbY45xXz4OKKkJ3R9MuiC1Ks6UfdZE6oaa9VS3XofedLR4rHHhm2gaaNmD-GmieEZA-1QnuHi-_ra4-ltU8Wh75gpvmeucAktI8PHaS94rzSCkhjcQt5TvFpojdOR5d3Lv_rfa-9jCBYg91qgKsxE-Xc9F-M4rO-wAnA7t3FUXwPSwyIcE5w"
              />
              <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="material-symbols-outlined text-white text-[32px]">
                  visibility
                </span>
              </div>
            </motion.div>

            {/* Gallery Item 2 */}
            <motion.div
              variants={itemVariants}
              className="aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm relative group cursor-pointer border border-surface-container-high/30"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt="Gallery 2"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO5XwOxzJXxujlXIDOFlRQ8K5zXsoZWP2YUHsohiX8evrJlD-uz8Lp8ScBEKYZG6JnQneP_QidefS7KKjQ9QXGO5QCDbwth4LE7RwRgAjAfrgwGVdh5pdGnUsSj3VHQWCGF1_lnn73zVchZg7rygzK-MPubQLkbQnOfLQs-JQR_a8jVHJPUSNHDn1EacPPThLsLIPq3XafYUazJuHOV_X6mSFJaU5sqy45wVe92hg9afKTi3o9MUGvMA"
              />
              <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="material-symbols-outlined text-white text-[32px]">
                  visibility
                </span>
              </div>
            </motion.div>

            {/* Gallery Item 3 */}
            <motion.div
              variants={itemVariants}
              className="aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm relative group cursor-pointer border border-surface-container-high/30"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt="Gallery 3"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvXxlegxKQm9gYr3zo_8mfujddmmndzkhTyZUMOEicG78RWC7WjEWw-uyc14pVjRQ6BWiYPBOqZigNPwZnqwCWWxQoY157S_omFA-rANSwcw2BAVNDJGWAJ9KF9fQ1RHfCeoa_V0UZeEy06Hs8AoI7aS2tIpoRyVdh70SAMoFKwP0cNfq1aCmsb1OM5PNfCrkDsUhSoQdZEf0t9F9DNy3_ZBkDrx9LOHRhT9BPWz7sMqWcVnQ563JMrQ"
              />
              <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="material-symbols-outlined text-white text-[32px]">
                  visibility
                </span>
              </div>
            </motion.div>

            {/* Gallery Item 4 */}
            <motion.div
              variants={itemVariants}
              className="aspect-square rounded-2xl overflow-hidden bg-surface-container shadow-sm relative group cursor-pointer border border-surface-container-high/30"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt="Gallery 4"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-1qU26CvQoNLxKqVQ-jkkMpTXOUN4D_aVCSNZ6e_MY6cS-MkEPvj_19iKKpljH4qYHoA9Rqc1XSvSXhRZFLiywcy1TGnE8sNhbyarwWpZ57YhHOc823F7C-wEUPDnsjU8VkFenFMt-PTOIGydF3ftdeBEj_KFKhaLGLcagUyMBn7sy-cItAfPC5VJRozU0HWS-J6jLp5UA8HiQaulI9S6DUcHFZIn4B_XD_yL1dAFAU_LQL9ubtIb4Q"
              />
              <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                <span className="material-symbols-outlined text-white text-[32px]">
                  visibility
                </span>
              </div>
            </motion.div>
          </motion.div>

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