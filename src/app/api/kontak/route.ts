import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Ambil data kontak dari Supabase (ID = 1)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('kontak_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      alamat: data.alamat,
      phone: data.phone,
      email: data.email,
      jamOperasional: data.jam_operasional,
      mapsEmbedUrl: data.maps_embed_url,
      mapsDirectionUrl: data.maps_direction_url,
      instagram: data.instagram,
      facebook: data.facebook,
      youtube: data.youtube,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data dari database.' }, { status: 500 });
  }
}

// POST: Update data kontak ke Supabase (ID = 1)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      id: 1,
      alamat: body.alamat,
      phone: body.phone,
      email: body.email,
      jam_operasional: body.jamOperasional,
      maps_embed_url: body.mapsEmbedUrl,
      maps_direction_url: body.mapsDirectionUrl,
      instagram: body.instagram,
      facebook: body.facebook,
      youtube: body.youtube,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('kontak_settings')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan kontak berhasil diperbarui di Supabase!',
      data,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan sistem saat menyimpan.' }, { status: 500 });
  }
}