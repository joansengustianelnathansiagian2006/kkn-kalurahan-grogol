'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  cluster: string;
  department: string;
  nim: string;
  imageUrl: string;
  isLeadership: boolean;
}

export default function HomeTimKKN() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setTeam(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          cluster: item.cluster,
          department: item.department,
          nim: item.nim,
          imageUrl: item.image_url || '',
          isLeadership: item.is_leadership || false,
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // data pimpinan (DPL/Kormanit) dan anggota biasa
  const leadershipMembers = team.filter((m) => m.isLeadership);
  const regularMembers = team.filter((m) => !m.isLeadership);

  return (
    <section className="py-16 bg-slate-50/60" id="tim-kkn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold mb-4">
            <span className="material-symbols-outlined text-base">groups</span>
            <span>TIM PENGABDIAN</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-950 leading-tight">
            Mengenal Tim KKN-PPM UGM Grogol 2026
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Kolaborasi lintas disiplin ilmu untuk mewujudkan Kalurahan Grogol yang mandiri, sejahtera, dan berbudaya melalui program pengabdian yang berdampak nyata.
          </p>
        </div>

        {/* PIMPINAN (DPL & KORMANIT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {isLoading ? (
            <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
              Memuat data pimpinan...
            </div>
          ) : leadershipMembers.length > 0 ? (
            leadershipMembers.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-full sm:w-44 aspect-square rounded-2xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-slate-300">
                      person
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left w-full">
                  <span className="inline-block bg-emerald-900 text-white text-xs font-semibold px-3.5 py-1 rounded-full mb-3">
                    {item.role || 'Pimpinan'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.department} {item.nim ? `/ ${item.nim}` : ''}
                  </p>
                  <div className="w-8 h-1 bg-emerald-700 rounded-full mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Belum ada pimpinan. Tambahkan data di admin dan centang <strong>"Tampilkan di bagian pimpinan atas"</strong>.
            </div>
          )}
        </div>

        {/* 3. ANGGOTA TIM */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Anggota Tim</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sub-unit dan penanggung jawab program kerja.
            </p>
          </div>

          {/* Grid Card Anggota */}
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Memuat data anggota...
            </div>
          ) : regularMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularMembers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/70 shadow-xs flex flex-col justify-between items-center text-center"
                >
                  <div className="w-full">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden relative mb-4 bg-slate-100 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-5xl text-slate-300">
                          person
                        </span>
                      )}
                      {item.cluster && (
                        <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase shadow-xs">
                          {item.cluster}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-800 text-base leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.department} {item.nim ? `/ ${item.nim}` : ''}
                    </p>
                  </div>

                  <div className="mt-4">
                    <span className="inline-block bg-emerald-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      {item.role || 'Anggota'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Belum ada anggota. Tambahkan anggota melalui halaman Admin Tim KKN.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}