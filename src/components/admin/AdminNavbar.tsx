'use client';

export default function AdminNavbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-slate-700">
          Sistem Informasi Desa Kalurahan Grogol
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          Administrator
        </span>
      </div>
    </header>
  );
}