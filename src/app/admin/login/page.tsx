'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Memicu autentikasi NextAuth
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Username atau password salah');
    } else if (result?.ok) {
      router.push('/admin');
      router.refresh(); // Memperbarui state middleware
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-slate-800 text-center">Login Admin</h1>
        
        {error && (
          <p className="text-xs text-rose-500 bg-rose-50 p-2.5 rounded-lg text-center font-medium border border-rose-200">
            {error}
          </p>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500"
            placeholder="Masukkan username"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500"
            placeholder="Masukkan password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}