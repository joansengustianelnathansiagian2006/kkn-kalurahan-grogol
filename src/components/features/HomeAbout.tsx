'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomeAbout() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      // margin negatif
      className="relative z-10 bg-background py-16 md:py-24"
    >
      <div className="max-w-container-max mx-auto w-full px-margin-desktop flex flex-col lg:flex-row gap-16 items-center">
        {/* Sisa kode di dalam HomeAbout tetap sama */} 
        {/* Visual Box + Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              alt="Kalurahan Grogol community event"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz9iyXL4tomC4JKd84e7bsUGV66pZNOZPA_9P8yYhuM0HUuvsELsaxAauT2Vy8Nl4k52n85YTdPCrX_Vy0_h7irtHVCtM6hau-S8ijbHnKzHb6gxL_s8mjb1RF20weUYk4nII1rsblnd5TtrQt1dYNW05DboaLvl_CxzQI5uzQjnf34hyhUKhlr9HHEmk5dP-YJesRyu3Ad3UOCAKPNgJR9C80qtWuFtay8lmR3lAiJdXzQuJ5tgV26Q"
            />
            {/* Ambient Lighting Background */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-tertiary/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>

          {/* Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -bottom-8 right-8 bg-surface/90 backdrop-blur-md shadow-xl rounded-2xl p-6 flex flex-col items-center border border-surface-container/50"
          >
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-3">
              <span
                className="material-symbols-outlined text-[32px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
            </div>
            <span className="font-body-bold text-body-bold text-on-surface">Desa Lestari</span>
          </motion.div>
        </motion.div>

        {/* Content Description */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-headline-md text-headline-md text-on-surface mb-6 relative pl-4 border-l-4 border-primary"
          >
            Tentang Kalurahan Grogol
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body-base text-body-base text-on-surface-variant mb-6 leading-relaxed"
          >
            Grogol bukan sekadar wilayah administratif, melainkan sebuah komunitas yang hidup dan
            bernapas dengan nilai-nilai kearifan lokal. Kami memadukan kekayaan tradisi agraris dengan
            inovasi digital untuk menciptakan ekosistem desa yang mandiri, transparan, dan berdaya saing
            tinggi.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-body-base text-body-base text-on-surface-variant mb-10 leading-relaxed"
          >
            Melalui platform Sobat Desa ini, kami mengundang Anda untuk menjelajahi potensi tersembunyi,
            mendukung produk lokal UMKM, dan berpartisipasi aktif dalam setiap program pembangunan desa
            kami.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/profil"
              className="inline-flex items-center gap-2 font-body-bold text-body-bold text-primary hover:text-primary-container transition-colors group"
            >
              Kenali Lebih Dalam
              <span className="material-symbols-outlined group-hover:translate-x-1.5 transition-transform duration-300">
                east
              </span>
            </Link>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}