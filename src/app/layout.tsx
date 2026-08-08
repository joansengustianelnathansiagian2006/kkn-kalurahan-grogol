// src/app/layout.tsx
// Kode Anda yang sudah ada, jangan diubah untuk menambahkan Navbar/Footer.
import "./global.css";

export const metadata = {
  title: "Kalurahan Grogol - Sobat Desa",
  description: "Sistem Informasi Desa Digital Kalurahan Grogol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      {/* Jaga agar body tetap bersih dari Navbar/Footer */}
      <body className="antialiased bg-[#f8fafc] text-slate-800 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}