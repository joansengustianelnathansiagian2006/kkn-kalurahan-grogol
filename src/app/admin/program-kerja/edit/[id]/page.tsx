'use client';

import { useSearchParams } from 'next/navigation';

export default function EditProgramKerjaPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Mengambil ID dari URL ?id=...

  return (
    <div>
      <h1 className="text-xl font-bold text-white">Edit Program Kerja #{id}</h1>
      {/* Form edit data */}
    </div>
  );
}