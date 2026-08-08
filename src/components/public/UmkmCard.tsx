interface UmkmCardProps {
    title?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
}

export default function UmkmCard({
    title = "Anyaman Bambu Lestari",
    category = "Kerajinan",
    description = "Produk kerajinan tangan khas Grogol yang dibuat dari bambu pilihan, memadukan desain modern dengan teknik anyaman tradisional.",
    imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBfNB15t2d0J5UhUiLsYMEIdUS3XLwsvhr0AMx9RV6KfdqVDHd3Mwjo4kv5Xexy94o1M8yv_0P0CnaAqCSnYFep4b6KTPuv6697vF7apNrrQDsJrIrPoFM_Cj1HlVSjiYgTt12C9iaosumgZqMfD-qaIf-4NkQG0pan7TEZzwBiokTxmo0us_21Cbz49ZTqLeNto6fXrKYrVbvzpVGYtiKJd9Ad0VSrXDPCOXC1Dz-mQ3t7asTn_hgS2g",
}: UmkmCardProps) {
    return (
        <div className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer">
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
                <div className="absolute top-4 left-4 bg-category-econ text-on-primary px-3 py-1 rounded-full font-label-caps text-label-caps shadow-md">
                    {category}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow bg-surface relative">
                <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h4>
                <p className="font-body-base text-body-base text-on-surface-variant line-clamp-2">
                    {description}
                </p>
            </div>
        </div>
    );
}