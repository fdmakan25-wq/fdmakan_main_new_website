'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';

interface Developer {
  _id: string;
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  establishedYear?: number;
  totalProjects?: number;
  rating?: number;
}

export default function FeaturedDevelopers() {
  const router = useRouter();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('/api/developers');
        if (!response.ok) return;
        const data = await response.json();
        const formatted: Developer[] = data.map((dev: {
          _id: string;
          name: string;
          logo?: string;
          description?: string;
          website?: string;
          establishedYear?: number;
          totalProjects?: number;
          rating?: number;
        }) => ({
          id: dev._id,
          _id: dev._id,
          name: dev.name,
          logoUrl: dev.logo || undefined,
          description: dev.description || undefined,
          website: dev.website || undefined,
          establishedYear: dev.establishedYear || undefined,
          totalProjects: dev.totalProjects || undefined,
          rating: dev.rating || 5,
        }));
        setDevelopers(formatted);
      } catch (error) {
        console.error('Error fetching developers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  if (!loading && developers.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-white via-slate-50/40 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand-teal bg-teal-50 px-3 py-1 rounded-full mb-2 border border-teal-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
              <span>Industry Leaders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Featured <span className="text-brand-red">Developers</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Partnering with India's most trusted, verified real estate builders
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-slate-500">
            <span>Verified Partners</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              100% Certified
            </span>
          </div>
        </div>

        {/* Developers Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading developers...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {developers.map((developer) => (
              <div
                key={developer.id}
                onClick={() => router.push(`/developers/${developer._id}`)}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-red/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden relative"
              >
                {/* Top Ambient Glow on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal via-brand-red to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Top Section: Brand Identity Header */}
                <div className="p-5 pb-4 border-b border-slate-100 flex items-center gap-3.5">
                  {/* Logo or Monogram Icon */}
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200/90 p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-slate-300 transition-colors">
                    {developer.logoUrl ? (
                      <SafeImage
                        src={developer.logoUrl}
                        alt={developer.name}
                        width={90}
                        height={90}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-black text-base shadow-inner">
                        {developer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Brand Titles */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight truncate group-hover:text-brand-red transition-colors">
                        {developer.name}
                      </h3>
                      <svg className="w-4 h-4 text-brand-teal shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified Developer">
                        <title>Verified Developer</title>
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                        Official Partner
                      </span>
                      {developer.rating ? (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ★ {developer.rating}.0
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Card Middle: Description & Quick Stats */}
                <div className="p-5 pt-3.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  {developer.description ? (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {developer.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Premier real estate builder delivering verified residential & commercial landmarks.
                    </p>
                  )}

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        Experience
                      </span>
                      <span className="text-xs font-black text-slate-800">
                        {developer.establishedYear ? `Since ${developer.establishedYear}` : 'Verified'}
                      </span>
                    </div>

                    <div className="border-l border-slate-200/80 pl-2.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                        Portfolio
                      </span>
                      <span className="text-xs font-black text-brand-red">
                        {developer.totalProjects ? `${developer.totalProjects}+ Projects` : 'Prime Portfolio'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action */}
                <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-brand-red transition-colors">
                  <span className="text-[11px] tracking-wide uppercase font-semibold">View Developer Portfolio</span>
                  <div className="w-6 h-6 rounded-full bg-white group-hover:bg-brand-red group-hover:text-white border border-slate-200 group-hover:border-brand-red flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-2xs">
                    <span className="text-xs">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
