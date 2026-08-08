const padukuhan = ['Grogol', 'Karang', 'Kebonagung', 'Kembang'];

const fasilitas = [
  {
    icon: 'medical_services',
    bgColor: 'bg-error-container',
    textColor: 'text-on-error-container',
    title: 'Puskesmas Pembantu',
    desc: 'Layanan kesehatan dasar terdekat.',
  },
  {
    icon: 'school',
    bgColor: 'bg-category-econ/20',
    textColor: 'text-category-econ',
    title: 'Sekolah Dasar (SD)',
    desc: '2 unit sekolah dasar negeri.',
  },
  {
    icon: 'mosque',
    bgColor: 'bg-primary-container/20',
    textColor: 'text-primary',
    title: 'Tempat Ibadah',
    desc: 'Masjid dan Mushola tersebar di tiap padukuhan.',
  },
];

export default function ProfilePadukuhan() {
  return (
    <section className="scroll-mt-32" id="padukuhan">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
        Padukuhan &amp; Fasilitas Umum
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daftar Padukuhan */}
        <div className="bg-surface shadow-sm rounded-2xl p-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">signpost</span>
            Daftar Padukuhan
          </h3>
          <div className="flex flex-col gap-2">
            {padukuhan.map((nama, i) => (
              <div
                key={nama}
                className="flex justify-between items-center p-3 hover:bg-surface-container-low rounded-lg transition-colors"
              >
                <span className="font-body-bold text-body-bold text-on-surface">
                  {i + 1}. {nama}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fasilitas */}
        <div className="bg-surface shadow-sm rounded-2xl p-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_hospital</span>
            Fasilitas
          </h3>
          <ul className="flex flex-col gap-4 font-body-base text-body-base text-on-surface-variant">
            {fasilitas.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded ${item.bgColor} ${item.textColor} flex items-center justify-center shrink-0`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div>
                  <span className="block font-body-bold text-on-surface">{item.title}</span>
                  <span className="text-sm">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
