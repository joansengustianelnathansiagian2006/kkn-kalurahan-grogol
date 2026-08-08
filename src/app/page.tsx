import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import HomeAbout from '@/components/features/HomeAbout';
import HomeHighlights from '@/components/features/HomeHighlights';
import HomeTimKKN from '@/components/features/HomeTimKKN';
import HomeNewsGallery from '@/components/features/HomeNewsGallery';
import Footer from '@/components/public/Footer';
import FloatingActions from '@/components/features/FloatingActions';
import { db } from '@/lib/db';

// Mencegah cache agar data Supabase selalu diperbarui
export const revalidate = 0;

export default async function Home() {
  // Tambahkan type annotation : any[] agar TypeScript tidak mengeluh
  let umkmList: any[] = [];
  let projaList: any[] = [];

  try {
    umkmList = await db.umkm.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Gagal mengambil data database:", error);
  }

  return (
    <main className="min-h-screen bg-background font-body-base text-on-surface">
      <Navbar />
      <div className="pt-20">
        <div className="w-full">
          <div className="flex flex-col w-full overflow-x-hidden">
            <HeroSection />
            <HomeAbout />
            <HomeHighlights umkmList={umkmList} projaList={projaList} />
            <HomeTimKKN />
            <HomeNewsGallery />
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActions />
    </main>
  );
}