'use client';

import { useEffect, useState } from 'react';

export default function FloatingActions() {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform z-50"
        aria-label="Hubungi via WhatsApp"
      >
        <span className="material-symbols-outlined">chat</span>
      </a>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-8 w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center text-on-surface-variant shadow-md hover:bg-primary hover:text-on-primary transition-all z-50 ${
          showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        aria-label="Kembali ke atas"
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>
    </>
  );
}
