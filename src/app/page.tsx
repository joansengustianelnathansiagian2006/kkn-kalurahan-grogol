import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import HomeAbout from '@/components/features/HomeAbout';
import HomeHighlights from '@/components/features/HomeHighlights';
import HomeTimKKN from '@/components/features/HomeTimKKN';
import HomeNewsGallery from '@/components/features/HomeNewsGallery';
import Footer from '@/components/public/Footer';
import FloatingActions from '@/components/features/FloatingActions';
import { db } from '@/lib/db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [
    umkmResult,
    projaResult,
    beritaResult,
    galeriResult,
    profilResult,
    totalUmkmResult,
    totalProjaResult,
  ] = await Promise.allSettled([
    db.umkm.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    db.programKerja.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    db.artikel.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
    }),
    db.galeri.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    db.profilDesa.findFirst(), // <-- Sudah diubah ke profilDesa
    db.umkm.count(),
    db.programKerja.count(),
  ]);

  const umkmList = umkmResult.status === 'fulfilled' ? umkmResult.value : [];
  const projaList = projaResult.status === 'fulfilled' ? projaResult.value : [];
  const beritaList = beritaResult.status === 'fulfilled' ? beritaResult.value : [];
  const galeriList = galeriResult.status === 'fulfilled' ? galeriResult.value : [];

  const profilDesa = profilResult.status === 'fulfilled' ? profilResult.value : null;
  const countUmkm = totalUmkmResult.status === 'fulfilled' ? totalUmkmResult.value : 0;
  const countProja = totalProjaResult.status === 'fulfilled' ? totalProjaResult.value : 0;

  const stats = {
    penduduk: profilDesa?.total_penduduk || '0',
    luasWilayah: profilDesa?.luas_wilayah || '0',
    totalUmkm: countUmkm,
    totalProja: countProja,
  };

  return (
    <main className="min-h-screen bg-background font-body-base text-on-surface">
      <Navbar />
      <div className="pt-20">
        <div className="w-full">
          <div className="flex flex-col w-full overflow-x-hidden">
            <HeroSection stats={stats} />
            <HomeAbout />
            <HomeHighlights umkmList={umkmList} projaList={projaList} />
            <HomeTimKKN />
            <HomeNewsGallery beritaList={beritaList} galeriList={galeriList} />
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActions />
    </main>
  );
}