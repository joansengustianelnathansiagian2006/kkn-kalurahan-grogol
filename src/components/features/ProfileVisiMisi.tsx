export default function ProfileVisiMisi() {
  return (
    <section className="scroll-mt-32" id="visi-misi">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visi */}
        <div className="bg-surface rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-on-tertiary-container">visibility</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Visi</h3>
          <p className="font-body-lg text-body-lg text-primary italic">
            &ldquo;Mewujudkan Masyarakat Kalurahan Grogol yang Sejahtera, Mandiri,
            Berbudaya, dan Berwawasan Lingkungan Berlandaskan Semangat Gotong
            Royong.&rdquo;
          </p>
        </div>

        {/* Misi */}
        <div className="bg-surface rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-on-secondary-container">flag</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Misi</h3>
          <ul className="flex flex-col gap-3 font-body-base text-body-base text-on-surface-variant list-none">
            <li className="flex gap-3">
              <span className="text-primary font-body-bold">01.</span>
              Meningkatkan kualitas sumber daya manusia melalui pendidikan dan kesehatan.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-body-bold">02.</span>
              Mengoptimalkan potensi ekonomi lokal dan UMKM.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-body-bold">03.</span>
              Melestarikan seni, budaya, dan kearifan lokal.
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-body-bold">04.</span>
              Menyelenggarakan tata kelola pemerintahan yang transparan dan melayani.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
