interface ProgramCardProps {
    title?: string;
    category?: string;
    status?: string;
    description?: string;
    imageUrl?: string;
}

export default function ProgramCard({
    title = "Pembangunan Fasilitas Air Bersih Dusun 2",
    category = "Infrastruktur",
    status = "Sedang Berjalan - 80%",
    description = "Proyek pengadaan saluran air bersih mandiri untuk memenuhi kebutuhan 150 Kepala Keluarga di wilayah Dusun 2.",
    imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuB_ksLqhjPuwWat71TpseMZdVy1DKuULhfXYeVL1ZrwYGx4GygjsyjbsYWf4zS7iO0LELVbKiOYO2F7tu0ffTgUOA8W3JFCiNqWPjpQwSis5lTLbTvOgEXef2ExejBGiBXCZ2wlvionwH5Y3UOb4Zg_PQopg8ZIi9gBpVOTZ3SQgNm5GB2IidKVcW7fCOFvjZzT5XMpYry6994GyAvkgkG6fHkQ3zHFq65k77h9hwmRL6rdDIegOrnuAg",
}: ProgramCardProps) {
    return (
        <div className="bg-surface rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center group cursor-pointer">
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                <img
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={imageUrl}
                />
            </div>
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-tertiary-container text-on-tertiary-container rounded font-label-caps text-[10px] uppercase">
                        {category}
                    </span>
                    <span className="text-text-muted font-body-base text-sm">
                        {status}
                    </span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h4>
                <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2">
                    {description}
                </p>
            </div>
            <div className="shrink-0 p-4 bg-surface-container rounded-full group-hover:bg-primary group-hover:text-on-primary transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">arrow_outward</span>
            </div>
        </div>
    );
}