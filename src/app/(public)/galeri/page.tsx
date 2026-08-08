'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface GaleriItem {
  id: number;
  title: string;
  type: 'foto' | 'video';
  media_url?: string;
  youtube_url?: string;
  description?: string;
  created_at: string;
}

// Helper mengekstrak YouTube Video ID
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Helper mendapatkan gambar thumbnail
function getThumbnail(item: GaleriItem): string {
  if (item.media_url) return item.media_url;
  const ytId = getYouTubeId(item.youtube_url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800';
}

export default function GaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<{ type: 'foto' | 'video'; index: number } | null>(null);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data as GaleriItem[]);
    }
    setLoading(false);
  };

  // Item foto dan video
  const photoItems = items.filter((item) => item.type === 'foto');
  const videoItems = items.filter((item) => item.type === 'video');

  // Item & daftar aktif untuk modal
  const activeModalList = modalState ? (modalState.type === 'foto' ? photoItems : videoItems) : [];
  const selectedItem = modalState && activeModalList[modalState.index] ? activeModalList[modalState.index] : null;
  const activeYtId = selectedItem ? getYouTubeId(selectedItem.youtube_url) : null;

  // Navigasi Slider Modal
  const handleNext = useCallback(() => {
    if (modalState && activeModalList.length > 0) {
      setModalState({
        ...modalState,
        index: (modalState.index + 1) % activeModalList.length,
      });
    }
  }, [modalState, activeModalList.length]);

  const handlePrev = useCallback(() => {
    if (modalState && activeModalList.length > 0) {
      setModalState({
        ...modalState,
        index: (modalState.index - 1 + activeModalList.length) % activeModalList.length,
      });
    }
  }, [modalState, activeModalList.length]);

  // Foto dari marquee
  const handlePhotoClick = (itemId: number) => {
    const index = photoItems.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      setModalState({ type: 'foto', index });
    }
  };

  // Video dari grid
  const handleVideoClick = (itemId: number) => {
    const index = videoItems.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      setModalState({ type: 'video', index });
    }
  };

  // Event Listener Keyboard & Lock Body Scroll
  useEffect(() => {
    if (!modalState) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalState(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalState, handleNext, handlePrev]);

  return (
    <div className="min-h-screen bg-[#f0f4f3] text-slate-800 pt-28 pb-20 font-sans">
      {/* CSS Animasi Marquee Dua Arah */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 40s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        
        {/* Header Utama Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2ece6] border border-emerald-200/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#064e3b] animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#064e3b]">
              Dokumentasi Kegiatan
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Galeri KKN Kalurahan Grogol
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Kumpulan momen berharga, dokumentasi foto, dan video pelaksanaan program kerja KKN di Kalurahan Grogol.
          </p>
        </div>

        {/* SECTION 1: RUNNING MARQUEE (FOTO) */}
        {!loading && photoItems.length > 0 && (
          <div className="mb-16 -mx-4 sm:-mx-6 md:-mx-10 overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#064e3b]"></span>
                </span>
                <h2 className="text-xs sm:text-sm font-extrabold text-[#064e3b] uppercase tracking-wider">
                  Sorotan Foto
                </h2>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Arahkan kursor untuk menghentikan
              </span>
            </div>

            <div className="space-y-4 py-2 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              {[0, 1].map((rowIndex) => {
                const isReverse = rowIndex === 1;
                const shiftedItems = [
                  ...photoItems.slice(rowIndex * 2),
                  ...photoItems.slice(0, rowIndex * 2),
                ];
                const displayList = shiftedItems.length > 0 ? shiftedItems : photoItems;

                return (
                  <div
                    key={`marquee-row-${rowIndex}`}
                    className={isReverse ? 'animate-marquee-reverse gap-4' : 'animate-marquee gap-4'}
                  >
                    {[...displayList, ...displayList, ...displayList].map((item, idx) => (
                      <div
                        key={`running-${rowIndex}-${item.id}-${idx}`}
                        onClick={() => handlePhotoClick(item.id)}
                        className="group relative h-48 w-72 md:h-56 md:w-80 shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:z-10"
                      >
                        <Image
                          src={getThumbnail(item)}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Gradient Overlay & Captions */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div>
                            <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                            <p className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1 mt-1">
                              <span className="material-symbols-outlined text-xs">zoom_in</span> Klik untuk perbesar
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: GALERI VIDEO (GRID) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-4">
            <span className="material-symbols-outlined text-[#064e3b] text-xl">play_circle</span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#064e3b] uppercase tracking-wider">
              Video
            </h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-500 font-medium">
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[#064e3b]">
                  progress_activity
                </span>
                <span className="text-xs">Memuat galeri video...</span>
              </div>
            </div>
          ) : videoItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/60 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">
                Belum ada video dokumentasi yang diunggah.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videoItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleVideoClick(item.id)}
                  className="group cursor-pointer bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={getThumbnail(item)}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#064e3b] text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase shadow-sm">
                      <span className="material-symbols-outlined text-xs">play_circle</span>
                      Video
                    </span>

                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#064e3b] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">play_arrow</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#064e3b] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL LIGHTBOX / POP-UP PREVIEW */}
        {selectedItem && modalState && (
          <div
            onClick={() => setModalState(null)}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]"
            >
              {/* Tombol Close */}
              <button
                onClick={() => setModalState(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              {/* Tombol Prev */}
              {activeModalList.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-[#064e3b] text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
              )}

              {/* Tombol Next */}
              {activeModalList.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-[#064e3b] text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              )}

              {/* Container Media */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                {selectedItem.type === 'video' && activeYtId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1`}
                    title={selectedItem.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedItem.type === 'video' && selectedItem.media_url ? (
                  <video
                    src={selectedItem.media_url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={getThumbnail(selectedItem)}
                    alt={selectedItem.title}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                )}
              </div>

              {/* Detail Teks Modal */}
              <div className="p-6 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-50 text-[#064e3b] border border-emerald-200/60 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedItem.type}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {modalState.index + 1} dari {activeModalList.length}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedItem.title}
                </h2>
                {selectedItem.description && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}