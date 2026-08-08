'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Pindahkan seluruh logika utama & return JSX halaman Anda ke dalam fungsi ini
function EditContent() {
  const searchParams = useSearchParams();
  // ... letakkan kode/state/logic halaman Anda di sini ...

  return (
    <div>
      {/* Isi UI Form Edit Anda */}
      <h1>Edit Program Kerja</h1>
    </div>
  );
}

// 2. Export default utama dibungkus dengan <Suspense>
export default function EditProgramKerjaPage() {
  return (
    <Suspense fallback={<div>Memuat halaman...</div>}>
      <EditContent />
    </Suspense>
  );
}