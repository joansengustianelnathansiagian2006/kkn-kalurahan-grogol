'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { supabase } from '@/lib/supabase';

interface ContactSettings {
  alamat: string;
  phone: string;
  email: string;
  jam_operasional: string;
  maps_embed_url: string;
  maps_direction_url: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export default function KontakPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone: '',
    subjek: '',
    pesan: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const mapFormRef = useRef<HTMLDivElement>(null);

  // Fetch data dari Supabase
  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const { data, error } = await supabase
          .from('kontak_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;
        if (data) setSettings(data);
      } catch (err) {
        console.error('Gagal mengambil data kontak:', err);
      } finally {
        setLoadingSettings(false);
      }
    }

    fetchContactSettings();
  }, []);

  // Animasi GSAP
  useEffect(() => {
    if (loadingSettings) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.contact-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      gsap.fromTo(
        mapFormRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );
    });

    return () => ctx.revert();
  }, [loadingSettings]);

  // Format nomor WhatsApp 
  const formattedWaNumber = settings?.phone ? settings.phone.replace(/\D/g, '') : '';

  // Handler Kirim Pesan Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Gagal mengirim pesan.');
      }

      // Kirim WhatsApp
      if (formattedWaNumber) {
        const text = `Halo Admin Kalurahan,\n\nNama: ${formData.nama}\nEmail: ${formData.email || '-'}\nNo. HP: ${formData.phone}\nSubjek: ${formData.subjek}\n\nPesan:\n${formData.pesan}`;
        window.open(`https://wa.me/${formattedWaNumber}?text=${encodeURIComponent(text)}`, '_blank');
      }

      setSubmitted(true);
      setFormData({ nama: '', email: '', phone: '', subjek: '', pesan: '' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan koneksi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pt-28 pb-20">
      {/* Background Gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-teal-500/25 to-emerald-400/20 blur-[130px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-20 -left-20 w-[450px] h-[450px] bg-cyan-600/15 blur-[150px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 space-y-12">
        {/* Header Hero Section */}
        <div ref={heroRef} className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
              Pusat Layanan & Informasi
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-teal-200">
            Hubungi Kalurahan
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Kami siap melayani kebutuhan informasi, pengaduan, dan aspirasi warga. Silakan hubungi kami melalui kanal di bawah ini.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Alamat */}
          <div className="contact-card group relative bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/15 transition-all" />
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all duration-300">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <h3 className="text-lg font-bold uppercase text-white mb-2">Alamat Kalurahan</h3>
            <p className="text-xs text-slate-400 leading-relaxed min-h-[2.5rem]">
              {settings?.alamat || ''}
            </p>
          </div>

          {/* Card 2: WhatsApp & Telepon */}
          <div className="contact-card group relative bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all" />
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <h3 className="text-lg font-bold uppercase text-white mb-2">WhatsApp / Telepon</h3>
            <p className="text-xs text-slate-400 mb-3">{settings?.jam_operasional || ''}</p>
            {formattedWaNumber ? (
              <a
                href={`https://wa.me/${formattedWaNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>+{formattedWaNumber}</span>
                <span className="material-symbols-outlined text-base">arrow_outward</span>
              </a>
            ) : null}
          </div>

          {/* Card 3: Email & Media Sosial */}
          <div className="contact-card group relative bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <h3 className="text-lg font-bold uppercase text-white mb-2">Email & Media Sosial</h3>
            {settings?.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="block text-xs text-slate-300 hover:text-cyan-400 transition-colors mb-4 truncate"
              >
                {settings.email}
              </a>
            ) : (
              <div className="h-4 mb-4" />
            )}

            {/* Social Icons Links */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 min-h-[45px]">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all text-xs font-bold"
                  title="Instagram"
                >
                  IG
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all text-xs font-bold"
                  title="Facebook"
                >
                  FB
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all text-xs font-bold"
                  title="YouTube"
                >
                  YT
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Map & Form Grid */}
        <div ref={mapFormRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sisi Kiri: Google Maps */}
          <div className="lg:col-span-7 relative h-[450px] sm:h-[520px] rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/50 shadow-2xl group">
            {settings?.maps_embed_url ? (
              <iframe
                src={settings.maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Kalurahan"
                className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-900/40 rounded-3xl" />
            )}

            {/* Petunjuk Arah */}
            {settings?.maps_direction_url && (
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-slate-950/80 border border-teal-500/30 backdrop-blur-xl p-4 sm:p-5 rounded-2xl flex items-center justify-between sm:gap-8 shadow-2xl">
                <div>
                  <p className="text-[10px] font-mono uppercase text-teal-400 font-bold tracking-wider">
                    Lokasi Kantor
                  </p>
                  <h4 className="text-sm font-bold text-white">Petunjuk Lokasi Peta</h4>
                </div>
                <a
                  href={settings.maps_direction_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95 whitespace-nowrap"
                >
                  <span>Petunjuk Arah</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            )}
          </div>

          {/* Sisi Kanan */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block mb-1">
                Kirim Pesan Langsung
              </span>
              <h3 className="text-2xl font-black uppercase text-white">Layanan Pengaduan</h3>
              <p className="text-xs text-slate-400 mt-1">
                Isi formulir di bawah ini untuk terhubung otomatis dengan WhatsApp Pelayanan.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300">
                {errorMessage}
              </div>
            )}

            {submitted ? (
              <div className="bg-teal-950/50 border border-teal-500/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h4 className="text-base font-bold text-white">Pesan Terkirim</h4>
                <p className="text-xs text-slate-300">
                  Terima kasih, pesan Anda telah tersimpan dan diteruskan.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-teal-400 underline uppercase tracking-wider"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama Anda..."
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      No. WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Subjek / Layanan *
                  </label>
                  <select
                    required
                    value={formData.subjek}
                    onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="">-- Pilih Layanan --</option>
                    <option value="Administrasi Kependudukan">Administrasi Kependudukan</option>
                    <option value="Permohonan Surat Keterangan">Permohonan Surat Keterangan</option>
                    <option value="Pengaduan & Aspirasi">Pengaduan & Aspirasi</option>
                    <option value="Informasi UMKM & Potensi">Informasi UMKM & Potensi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Pesan Anda *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-300 shadow-xl shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Kirim via WhatsApp</span>
                      <span className="material-symbols-outlined text-sm">send</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Floating Widget WhatsApp Button */}
      {formattedWaNumber ? (
        <a
          href={`https://wa.me/${formattedWaNumber}?text=Halo%20Admin,%20saya%20butuh%20bantuan%20mengenai%20layanan%20Kalurahan.`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-slate-900/90 border border-teal-500/40 p-3 pr-5 rounded-full backdrop-blur-xl shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold">
            <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="material-symbols-outlined relative text-xl">chat</span>
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-[9px] font-mono uppercase text-teal-400 font-bold tracking-wider">
              Bantuan 24/7
            </span>
            <span className="block text-xs font-bold text-white">Chat WhatsApp</span>
          </div>
        </a>
      ) : null}
    </div>
  );
}