import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/public/Footer';
import ProfileScrollSpy from '@/components/features/ProfileScrollSpy';
import ProfileSejarah from '@/components/features/ProfileSejarah';
import ProfileVisiMisi from '@/components/features/ProfileVisiMisi';
import ProfileGeografi from '@/components/features/ProfileGeografi';
import ProfilePadukuhan from '@/components/features/ProfilePadukuhan';
import FloatingActions from '@/components/features/FloatingActions';

export const metadata: Metadata = {
  title: 'Profil Kalurahan – Kalurahan Grogol',
  description:
    'Mengenal lebih dalam Kalurahan Grogol: sejarah, visi misi, geografi, demografi, padukuhan, dan fasilitas umum.',
};

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-background font-body-base text-on-surface">
      {/* Breadcrumb */}
      <div className="bg-surface-container-low/50 border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-desktop py-4 flex items-center gap-2 text-label-caps text-text-muted font-body-base">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">Profil</span>
        </div>
      </div>

      {/* Main Content: Sticky Sidebar + Overlapping Sections */}
      <div className="w-full flex flex-col pb-section-gap-lg">
        <div className="max-w-container-max mx-auto px-margin-desktop w-full mt-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Sticky Sidebar with Scroll Spy */}
          <div className="lg:col-span-3 sticky top-32 z-50">
            <ProfileScrollSpy />
          </div>

          {/* Overlapping Content Sections (Card Stacking Style) */}
          <div className="lg:col-span-9 flex flex-col gap-10 relative">
            
            {/* Layer 1: Sejarah */}
            <div className="sticky top-28 z-10 bg-surface-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 backdrop-blur-md">
              <ProfileSejarah />
            </div>

            {/* Layer 2: Visi Misi */}
            <div className="sticky top-28 z-20 bg-surface-white rounded-3xl p-6 md:p-8 shadow-md border border-outline-variant/20 backdrop-blur-md">
              <ProfileVisiMisi />
            </div>

            {/* Layer 3: Geografi */}
            <div className="sticky top-28 z-30 bg-surface-white rounded-3xl p-6 md:p-8 shadow-lg border border-outline-variant/20 backdrop-blur-md">
              <ProfileGeografi />
            </div>

            {/* Layer 4: Padukuhan */}
            <div className="sticky top-28 z-40 bg-surface-white rounded-3xl p-6 md:p-8 shadow-xl border border-outline-variant/20 backdrop-blur-md">
              <ProfilePadukuhan />
            </div>

          </div>
        </div>
      </div>

      <Footer />
      <FloatingActions />
    </div>
  );
}