const stats = [
  {
    icon: 'landscape',
    iconColor: 'text-category-agri',
    value: '324',
    label: 'Hektar Luas Wilayah',
  },
  {
    icon: 'group',
    iconColor: 'text-category-soc',
    value: '5.2K',
    label: 'Jiwa Penduduk',
  },
  {
    icon: 'home_work',
    iconColor: 'text-category-econ',
    value: '1.4K',
    label: 'Kepala Keluarga',
  },
  {
    icon: 'share_location',
    iconColor: 'text-primary',
    value: '6',
    label: 'Padukuhan',
  },
];

export default function ProfileGeografi() {
  return (
    <section className="scroll-mt-32" id="geografi">
      <div className="flex flex-col gap-8">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Geografi &amp; Demografi
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:scale-[1.02] transition-transform"
            >
              <span className={`material-symbols-outlined text-[32px] ${stat.iconColor} mb-2`}>
                {stat.icon}
              </span>
              <span className="font-display-lg text-display-lg text-on-surface">{stat.value}</span>
              <span className="font-label-caps text-label-caps text-text-muted mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div
          className="w-full h-80 rounded-3xl overflow-hidden shadow-md relative"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlGuTCkaqXirzQ0RLMVFoebEc52T0ASQZpQQYhh93J74OFh5EeyDgiK7uDR5C7KCHIavfXvb1U44Xx0zqSC8UisJvjmCpozCF5kxmspmcVttkxbwh0tGs5vUW572NQRjyfL0Z4a062woo54xX6jnyUQp8OWxYbMAjEr5Ub1N7wRscBvbWqsv0tK40ci5_j2JFE_nlMwt_n1QLlBsG6mJsw_Hv-oRh4edy-uRznFARPPjUYadQd7DmuLQ')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
            <span className="font-body-bold text-body-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">map</span>
              Peta Wilayah Grogol
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
