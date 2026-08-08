interface UmkmHeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function UmkmHeroSection({
  searchQuery,
  onSearchChange,
}: UmkmHeroSectionProps) {
  return (
    <section className="relative w-full max-w-container-max mx-auto px-margin-desktop pt-12 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-tertiary-fixed/10 to-transparent pointer-events-none rounded-3xl -z-10" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-fixed/20 blur-3xl rounded-full mix-blend-multiply pointer-events-none -z-10" />
      <div className="max-w-3xl">
        <span className="text-label-caps font-label-caps text-primary tracking-widest uppercase mb-4 block">
          Potensi Ekonomi Lokal
        </span>
        <h1 className="text-display-xl font-display-xl text-on-surface mb-6 leading-tight">
          Dukung Usaha <br />
          <span className="text-primary italic">Mikro, Kecil, &amp; Menengah</span>
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-2xl">
          Temukan beragam produk kreatif, kuliner autentik, dan layanan jasa dari warga Desa Grogol. Membeli produk UMKM berarti membangun perekonomian desa.
        </p>

        <div className="bg-surface rounded-full shadow-lg p-2 flex items-center max-w-xl transition-all duration-300 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20 backdrop-blur-xl bg-surface/80 relative z-10">
          <span className="material-symbols-outlined text-text-muted ml-4">search</span>
          <input
            className="w-full bg-transparent border-none outline-none px-4 py-3 text-body-base font-body-base text-on-surface placeholder:text-text-muted"
            placeholder="Cari nama UMKM atau produk..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-body-bold text-body-bold hover:bg-on-primary-fixed-variant transition-colors shadow-md shrink-0">
            Cari
          </button>
        </div>
      </div>
    </section>
  );
}
