'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  cluster?: string;
  department?: string;
  nim?: string;
  imageUrl?: string;
  isLeadership?: boolean;
}

interface HomeHighlightsProps {
  umkmList?: any[];
  projaList?: any[];
  teamList?: TeamMember[];
  leadershipList?: TeamMember[];
}

export default function HomeHighlights({
  umkmList = [],
  projaList = [],
  teamList = [],
  leadershipList = [],
}: HomeHighlightsProps) {
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

  const cardRotations = ['rotate-[-1deg]', 'rotate-[2deg]', 'rotate-[-2deg]', 'rotate-[1deg]'];

  return (
    <section className="relative z-10 bg-transparent pt-16 pb-24 border-t border-surface-container-high/40 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        
        {/* UMKM HEADER & GRID */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {umkmList.length > 0 ? (
            umkmList.map((item) => {
              const title = item.title || item.name || item.nama || item.nama_umkm || item.judul || 'UMKM';
              const image = item.imageUrl || item.image_url || item.image || item.foto || item.gambar || '/images/placeholder.jpg';
              const category = item.category || item.kategori || 'UMKM';
              const description = item.description || item.deskripsi || item.detail || '';

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
                        {category}
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

        {/* PROGRAM KERJA HEADER & ITEM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-end mb-10 pt-6"
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6 mb-24"
        >
          {projaList.length > 0 ? (
            projaList.map((proja) => {
              const title = proja.title || proja.nama || proja.nama_program || proja.judul || 'Program Kerja';
              const image = proja.imageUrl || proja.image_url || proja.image || proja.foto || proja.gambar || '/images/placeholder.jpg';
              const category = proja.category || proja.kategori || 'Program';
              const description = proja.description || proja.deskripsi || proja.detail || '';

              return (
                <Link
                  key={proja.id}
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
              );
            })
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              Belum ada data Program Kerja.
            </div>
          )}
        </motion.div>

        {/*  TIM KKN SECTION  */}
        {(leadershipList.length > 0 || teamList.length > 0) && (
          <section className="pt-8 border-t border-surface-container-high/40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md uppercase tracking-widest mb-4 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">group</span>
                Tim Pengabdian
              </div>
              <h3 className="font-headline-md md:font-headline-lg text-primary max-w-3xl mb-3">
                Mengenal Tim KKN-PPM UGM Grogol 2026
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-2xl">
                Kolaborasi lintas disiplin ilmu untuk mewujudkan Kalurahan Grogol yang mandiri, sejahtera, dan berbudaya melalui program pengabdian yang berdampak nyata.
              </p>
            </motion.div>

            {/* DPL & Kormanit Cards */}
            {leadershipList.length > 0 && (
              <div className="w-full flex flex-col md:flex-row gap-6 mb-16">
                {leadershipList.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 bg-surface-container rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xs hover:shadow-md transition-shadow duration-300 group"
                  >
                    <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shrink-0 relative bg-surface-dim flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary-container flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <span className="material-symbols-outlined text-[72px] text-on-secondary-container">
                            person
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex flex-col flex-1 justify-center text-center md:text-left">
                      <div className="mb-3">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-[12px] font-bold tracking-wide shadow-xs">
                          {item.role}
                        </span>
                      </div>
                      <h4 className="font-headline-sm md:font-headline-md text-primary group-hover:text-primary-container transition-colors mb-1 font-bold">
                        {item.name}
                      </h4>
                      <p className="font-body-md text-on-surface-variant mb-4">
                        {item.department} {item.nim ? `/ ${item.nim}` : ''}
                      </p>
                      <div className="w-12 h-1 bg-primary rounded-full mx-auto md:mx-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Header Anggota Tim */}
            <div className="mb-8">
              <h4 className="font-headline-md text-on-surface">Anggota Tim</h4>
              <p className="font-body-md text-on-surface-variant mt-1">
                Sub-unit dan penanggung jawab program kerja.
              </p>
            </div>

            {teamList.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {teamList.map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    className={`bg-surface-white p-5 rounded-2xl shadow-md hover:-translate-y-2 transition-all duration-300 ${
                      cardRotations[index % cardRotations.length]
                    } group border border-surface-container/50`}
                  >
                    <div className="w-full aspect-square bg-surface-dim mb-4 rounded-xl overflow-hidden relative flex items-center justify-center">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-tertiary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-[64px] text-on-tertiary-container opacity-60">
                            face
                          </span>
                        </div>
                      )}

                      {member.cluster && (
                        <div className="absolute bottom-2.5 right-2.5 bg-primary/90 text-on-primary text-[10px] font-label-md px-2.5 py-1 rounded-md backdrop-blur-sm uppercase font-bold tracking-wider">
                          {member.cluster}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <h5 className="font-headline-sm text-[20px] text-primary group-hover:text-primary-container transition-colors leading-tight mb-1 font-bold">
                        {member.name}
                      </h5>

                      <p className="font-body-md text-[13px] text-on-surface-variant mb-4 line-clamp-1">
                        {member.department} {member.nim ? `/ ${member.nim}` : ''}
                      </p>

                      <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-[12px] font-bold tracking-wide shadow-xs transition-transform group-hover:scale-105">
                        {member.role}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        )}

      </div>
    </section>
  );
}