'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Ganti 'admin123' dengan password rahasia
    if (password === 'admin123') {
      document.cookie = 'admin_token=active; path=/; max-age=86400'; // Cookie berlaku 1 hari
      router.push('/admin');
    } else {
      setError('Password rahasia salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl border border-slate-700">
        <div className="text-center mb-6">
          <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">admin_panel_settings</span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h1>
          <p className="text-xs text-slate-400 mt-1">Kalurahan Grogol Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Secret Key / Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all"
          >
            Masuk Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}