'use client';

export interface UmkmItem {
  id: string;
  name: string;
  categoryKey: 'food' | 'craft' | 'services' | 'agri';
  categoryLabel: string;
  categoryBg: string;
  description: string;
  imageUrl: string;
  iconName: string;
  iconBgClass: string;
  iconTextClass: string;
  productsLabel: string;
  products: string[];
  whatsappUrl: string;
}

export const sampleUmkmData: UmkmItem[] = [
  {
    id: '1',
    name: 'Dapur Ibu Siti',
    categoryKey: 'food',
    categoryLabel: 'Kuliner',
    categoryBg: 'bg-category-econ/90',
    description:
      'Menyediakan berbagai macam jajanan pasar basah dan kering tradisional khas Jawa dengan resep warisan leluhur. Menerima pesanan untuk acara.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDfsnBfTUpKEv0W_FQ-dSg7r9VUT4CP0QW5_4jGZ9kksP2zpSFfOcTh3lkJRsMcC4SGRpPqYVjuLstNs58ZvzQS9wNiDV7JhSrQoq5xZI5R9fgbPxaJ30QmWEnJKoyZknFGw6OtZJJeOo2bKfV9RksHYciwjFyyKizsl1NRcTPEEKQe16i73Qax58fg1GLV4OvwDSWiygSQXurPzhWbgmk0RSz5WjDZ5WNOVimA6oPoXmVUjAWu5NS7sQ',
    iconName: 'restaurant',
    iconBgClass: 'bg-secondary-container',
    iconTextClass: 'text-on-secondary-container',
    productsLabel: 'Produk Unggulan',
    products: ['Klepon', 'Getuk Lindri', 'Lemper'],
    whatsappUrl: 'https://wa.me/6281234567890',
  },
  {
    id: '2',
    name: 'Kriya Bambu Aji',
    categoryKey: 'craft',
    categoryLabel: 'Kerajinan',
    categoryBg: 'bg-category-soc/90',
    description:
      'Kerajinan tangan berbahan dasar bambu lokal. Memproduksi perabot rumah tangga, hiasan dinding, dan suvenir pernikahan unik.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfc514uTJ0DKyyeW8hXx2vtX7DodejoGeOYNep5Xa67AxXNQv5_kbuJ7cw027V5VuBo3MCIcQqSsmH0CsxMOQSbdQyZUU9TqncNgEn4ZZzn9JErUVH_dHmetDl0p631DRNW3fAyH9Ky2lKBLX1__i0LVaU3R8ZLmmFA9p7-HJ1hEKLhxdhW7qjgBESJyvekR7OunG7ezZDyN4OEpVe3HvD9X6n1diDgZvzpZMrKuRSnuGwK9GfRtvO2w',
    iconName: 'architecture',
    iconBgClass: 'bg-tertiary-container',
    iconTextClass: 'text-on-tertiary-container',
    productsLabel: 'Produk Unggulan',
    products: ['Keranjang', 'Lampu Hias', 'Tampah'],
    whatsappUrl: 'https://wa.me/6281234567891',
  },
  {
    id: '3',
    name: 'Bengkel Motor Jaya',
    categoryKey: 'services',
    categoryLabel: 'Jasa',
    categoryBg: 'bg-outline/90',
    description:
      'Layanan servis motor segala merek, ganti oli, tune up, dan perbaikan ringan hingga berat. Montir berpengalaman lebih dari 10 tahun.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUbGz4LdDRGrX4NghmMmvAnwlmHfMfn2wETZNgdmQr8flQsydAj_gATE6StoixCSFO5Fhn020I45YQdwwo5txKcccqiF9S-bg8E40sBwd_U5gLV3TovzGnXlP18lm6BWQVKBxB1LQVh_CW7RYBlsG86XGJ9aqwPE7aEciLjdHmCCyykbW0hBiBIVV464qOMucxpfnd9u1vcIp5a5Kz407qJUzX4c_OMFPWHaW5HHSGXZzGsebDPQol7A',
    iconName: 'build',
    iconBgClass: 'bg-primary-container',
    iconTextClass: 'text-on-primary-container',
    productsLabel: 'Layanan',
    products: ['Servis Rutin', 'Ganti Oli', 'Sparepart'],
    whatsappUrl: 'https://wa.me/6281234567892',
  },
  {
    id: '4',
    name: 'Kebun Sayur Organik',
    categoryKey: 'agri',
    categoryLabel: 'Hasil Bumi',
    categoryBg: 'bg-category-agri/90',
    description:
      'Hasil panen sayuran hidroponik dan organik yang segar setiap pagi. Bebas pestisida kimia, sehat, dan langsung dari petani lokal.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDI3oCWAmz55UDEot-48V3cUCeSZeEBl42_JEq7MLox3QaYMWdXJqFW1AOW88W6UUGwBbK1seeignRs-N-_lOIdZNMWWTvI-qFssOA4prQh86_r2CePryZwkzYm-occFBoSYSRVl-0EmJHpQ9Mkcd0zs4j8A8TWA2SGifBgL_SAAgE5vN8ly-qgjLHNTRTM2f5y-1CngP_lIzfMPA3thcCS19llXc6LbuxGutRZLwiHJhQczoQccCQWKg',
    iconName: 'eco',
    iconBgClass: 'bg-secondary-fixed',
    iconTextClass: 'text-on-secondary-fixed',
    productsLabel: 'Produk Unggulan',
    products: ['Selada Air', 'Pakcoy', 'Tomat Ceri'],
    whatsappUrl: 'https://wa.me/6281234567893',
  },
];

const categories = [
  { key: 'all', label: 'Semua Kategori' },
  { key: 'food', label: 'Kuliner & Makanan' },
  { key: 'craft', label: 'Kerajinan Tangan' },
  { key: 'services', label: 'Jasa & Layanan' },
  { key: 'agri', label: 'Hasil Bumi' },
];

interface UmkmFilterGridProps {
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function UmkmFilterGrid({
  searchQuery,
  selectedCategory,
  onSelectCategory,
}: UmkmFilterGridProps) {
  const filteredData = sampleUmkmData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.categoryKey === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.products.some((p) => p.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Filter Category Section */}
      <section className="max-w-container-max mx-auto px-margin-desktop w-full mb-12 relative z-20">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`snap-start whitespace-nowrap px-6 py-2 rounded-full font-label-caps text-label-caps transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-md scale-105'
                    : 'bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container hover:scale-105'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid & Empty State Section */}
      <section className="max-w-container-max mx-auto px-margin-desktop w-full mb-section-gap-lg">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative"
              >
                {/* Badge Category */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`${item.categoryBg} backdrop-blur-md text-white px-3 py-1 rounded-full text-label-caps font-label-caps shadow-sm`}
                  >
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Card Image */}
                <div className="w-full h-56 relative overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={item.name}
                    src={item.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-80" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col bg-surface relative z-20 -mt-6 rounded-t-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-full ${item.iconBgClass} flex items-center justify-center shrink-0 shadow-inner`}
                    >
                      <span className={`material-symbols-outlined ${item.iconTextClass}`}>
                        {item.iconName}
                      </span>
                    </div>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-body-base font-body-base text-on-surface-variant mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-auto">
                    <div className="text-label-caps font-label-caps text-text-muted mb-2 uppercase tracking-wide">
                      {item.productsLabel}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.products.map((prod) => (
                        <span
                          key={prod}
                          className="bg-surface-container-high px-2 py-1 rounded text-xs text-on-surface-variant"
                        >
                          {prod}
                        </span>
                      ))}
                    </div>

                    <a
                      href={item.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white py-3 rounded-xl font-body-bold text-body-bold transition-all duration-300"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                      Hubungi via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-text-muted">
                search_off
              </span>
            </div>
            <h4 className="text-headline-md font-headline-md text-on-surface mb-2">
              UMKM tidak ditemukan
            </h4>
            <p className="text-body-base font-body-base text-on-surface-variant">
              Coba gunakan kata kunci lain atau ubah filter kategori.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
