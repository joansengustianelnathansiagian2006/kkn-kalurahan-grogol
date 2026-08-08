export default function ProfileSejarah() {
  return (
    <section className="scroll-mt-32" id="sejarah">
      {/* Hero Card */}
      <div className="relative bg-primary-container text-on-primary-container rounded-3xl p-10 overflow-hidden shadow-lg group">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEfOz3dwruTmFqiUH0BmNE7hFy6LV2UH_ZvLG-VeV2xKV617YtffWUkpKc6tCHpsOS-zuUfr7m21GPcj0wYYljgQOmw2FmGYZi-e_VDbS53EAwEyUTfAq6c3_Jr9De88TltDwb9iKOjoj9lWxG3qAyKhCr_I09-zDR4V-HUmDEQRgyhvAvpr8uT7K75rch5oyWiySCQrb3Nw-5TrW1LkhwzZD_hcZWz9Jjw6cWFRvgV-NZCBYsaK6vxQ')",
          }}
        />
        <div className="relative z-10 max-w-2xl">
          <span className="text-label-caps font-label-caps uppercase tracking-widest text-primary-fixed mb-4 block">
            Asal Usul
          </span>
          <h2 className="font-display-lg text-display-lg mb-6">Sejarah Desa Grogol</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container/90">
            Berakar dari tradisi panjang masyarakat agraris, Kalurahan Grogol terus
            berkembang menjaga kearifan lokal sembari melangkah menuju kemajuan.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-12 ml-4">
        <div className="relative border-l-2 border-outline-variant/30 pl-8 pb-8">
          <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1" />
          <h4 className="font-headline-md text-headline-md text-primary mb-2">1920-an</h4>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Awal terbentuknya pemukiman yang berpusat pada pertanian subsisten. Nama
            Grogol dipercaya berasal dari kata &apos;Grogol&apos; yang berarti tempat yang
            tinggi atau tangguh.
          </p>
        </div>
        <div className="relative border-l-2 border-outline-variant/30 pl-8 pb-8">
          <div className="absolute w-4 h-4 bg-surface border-2 border-primary rounded-full -left-[9px] top-1" />
          <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Era Kemerdekaan</h4>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Menjadi titik penting dalam mempertahankan keamanan wilayah, dengan
            kontribusi masyarakat dalam menjaga lumbung pangan lokal.
          </p>
        </div>
        <div className="relative pl-8 pb-4">
          <div className="absolute w-4 h-4 bg-surface border-2 border-primary rounded-full -left-[9px] top-1" />
          <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
            Modernisasi &amp; Digitalisasi
          </h4>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Grogol bertransformasi menjadi Kalurahan yang responsif terhadap teknologi,
            mengintegrasikan sistem informasi desa tanpa meninggalkan akar budayanya.
          </p>
        </div>
      </div>
    </section>
  );
}
