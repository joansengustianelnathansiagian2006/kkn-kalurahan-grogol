import HomeAbout from '@/components/features/HomeAbout';
import HomeHighlights from '@/components/features/HomeHighlights';
import HomeTimKKN from '@/components/features/HomeTimKKN';
import { supabase } from '@/lib/supabase';

// Memastikan data selalu direfresh dari Supabase (anti-cache)
export const revalidate = 0;

export default async function HomePage() {
  // 1. Fetch 3 UMKM terbaru dari database
  const { data: umkmData, error: umkmError } = await supabase
    .from('umkm')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // 2. Fetch 3 Program Kerja terbaru dari database
  const { data: projaData, error: projaError } = await supabase
    .from('program_kerja')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  // Cek output data & error di Terminal VS Code / Server Log
  console.log('=== DEBUG SUPABASE HOME ===');
  console.log('Data UMKM:', umkmData);
  console.log('Error UMKM:', umkmError);
  console.log('Data Proja:', projaData);
  console.log('Error Proja:', projaError);

  return (
    <main>
      {/* Komponen Fitur Home */}
      <HomeAbout />

      {/* Oper data UMKM dan Program Kerja ke HomeHighlights */}
      <HomeHighlights 
        umkmList={umkmData || []} 
        projaList={projaData || []} 
      />

      {/* Komponen Tim KKN Dinamis dari Supabase */}
      <HomeTimKKN />
    </main>
  );
}