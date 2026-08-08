import Link from "next/link";

export default function HeroSection() {
    return (
        <>
            {/* Hero Section */}
            <section
                className="relative w-full h-[819px] min-h-[600px] flex items-end pb-24 lg:pb-32"
                style={{
                    backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5Dp99BZvgzWANW8Z0ebaBovmCY-IKBpCf7t7oO1SrwwN7pqdWOYxsypGbE3wxhuHQBvq90HBdMHTV1fTFr4OEwyBzDyDSIUykUonklFzSI00Lp5n_2v9_Ntv-K6XiTuz6JHfVQV0mbRgObYpVOFEJMvWjhrJfL285niJ0Fsu9ousn59YlMIjIVYd9FalSVzQ4tVnbA_uEgoE_LiL2qooX3vm278Z-HZqwgPnghZVcXZE2ZM5Yz0D8ew')",
                }}
            >
                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent mix-blend-multiply pointer-events-none" />

                <div className="relative z-10 max-w-container-max mx-auto w-full px-margin-desktop flex flex-col items-start">
                    <span className="inline-block px-4 py-1.5 mb-6 bg-primary/20 backdrop-blur-md rounded-full font-label-caps text-label-caps text-on-primary-container uppercase tracking-widest shadow-lg">
                        Selamat Datang di
                    </span>
                    <h1 className="font-display-xl text-display-xl text-surface mb-6 max-w-3xl leading-tight">
                        Harmoni Tradisi &amp; <br />
                        Inovasi Digital
                    </h1>
                    <p className="font-body-lg text-body-lg text-surface-variant max-w-2xl mb-10 opacity-90">
                        Sistem Informasi Desa Digital Kalurahan Grogol. Membangun masa
                        depan yang berkelanjutan berlandaskan kearifan lokal, memajukan
                        ekonomi desa melalui transparansi dan kolaborasi.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/program-kerja"
                            className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 px-8 py-4 rounded-full font-body-bold text-body-bold shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Jelajahi Desa
                            <span className="material-symbols-outlined text-[20px]">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Statistics Overlay */}
            <div className="relative z-20 max-w-container-max mx-auto w-full px-margin-desktop -mt-16 mb-section-gap-sm">
                <div className="bg-surface/90 backdrop-blur-xl shadow-xl rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center">
                        <span className="font-display-lg text-display-lg text-primary mb-2">
                            4.2K
                        </span>
                        <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
                            Penduduk
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="font-display-lg text-display-lg text-primary mb-2">
                            350
                        </span>
                        <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
                            Hektar Luas Wilayah
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="font-display-lg text-display-lg text-primary mb-2">
                            84
                        </span>
                        <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
                            UMKM Aktif
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="font-display-lg text-display-lg text-primary mb-2">
                            12
                        </span>
                        <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
                            Program Unggulan
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}