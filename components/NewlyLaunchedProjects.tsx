'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import { formatPropertyPrice } from '@/lib/property-details-display';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';

interface LaunchProject {
  id: string;
  name: string;
  developer: string;
  price: string;
  typology: string;
  location: string;
  city?: string;
  image: string;
  description?: string;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop';

export default function NewlyLaunchedProjects() {
  const [projects, setProjects] = useState<LaunchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewlyLaunched = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();
        const filtered = data
          .filter((prop: { showInNewlyLaunched?: boolean }) => prop.showInNewlyLaunched === true)
          .sort((a: { createdAt?: string }, b: { createdAt?: string }) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });

        const formatted: LaunchProject[] = filtered.map(
          (prop: {
            _id: string;
            name: string;
            developer?: string;
            price: number;
            bedrooms?: number;
            propertyType?: string;
            listingFor?: string;
            location: string;
            city?: string;
            description?: string;
            images?: string[];
            pricing?: Array<{ price?: string }>;
          }) => ({
            id: prop._id,
            name: prop.name,
            developer: prop.developer || 'Reputed Developer',
            price: formatPropertyPrice(prop.price, prop.listingFor, prop.pricing),
            typology: prop.bedrooms
              ? `${prop.bedrooms} BHK`
              : getPropertyTypeLabel(prop.propertyType || '') || 'Premium Residence',
            location: prop.location,
            city: prop.city,
            description: prop.description,
            image: prop.images?.[0] || PLACEHOLDER_IMAGE,
          })
        );

        setProjects(formatted);
      } catch (error) {
        console.error('Error fetching newly launched:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewlyLaunched();
  }, []);

  if (!loading && projects.length === 0) return null;

  const featured = projects[0];
  const listItems = projects.slice(1, 5);

  return (
    <section className="py-7 md:py-10 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 sm:w-80 h-64 sm:h-80 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-7 gap-3 border-b border-slate-800 pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-red/20 to-orange-500/20 border border-brand-red/30 px-3 py-1 rounded-full text-brand-red text-[11px] font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
              Latest Releases
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Newly Launched <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-400">Projects</span>
            </h2>
          </div>

          <a
            href="/properties?filter=newly-launched"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition group self-start sm:self-auto"
          >
            Explore all new releases
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Flagship Hero Card */}
            {featured && (
              <div
                onClick={() => {
                  window.location.href = `/view-details/${featured.id}`;
                }}
                className="lg:col-span-7 group relative bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl hover:border-slate-500 cursor-pointer flex flex-col justify-between transition-all duration-300"
              >
                <div className="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden">
                  <SafeImage
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                  
                  {/* Top tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="bg-brand-red text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      ★ Flagship Debut
                    </span>
                    <span className="bg-slate-900/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                      Bookings Open
                    </span>
                  </div>

                  {/* Title & Developer inside image visual */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-brand-teal text-[11px] sm:text-xs font-semibold tracking-wide uppercase mb-0.5">
                      {featured.developer}
                    </p>
                    <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-black leading-tight group-hover:text-amber-300 transition-colors">
                      {featured.name}
                    </h3>
                  </div>
                </div>

                {/* Bottom Spec Footer */}
                <div className="p-4 sm:p-5 bg-slate-800/90 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 min-w-0">
                    <div className="flex items-center gap-1 truncate font-medium">
                      <svg className="w-4 h-4 text-brand-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="truncate">{featured.location}</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span className="bg-slate-700/70 text-slate-200 px-2.5 py-0.5 rounded font-semibold text-xs shrink-0">
                      {featured.typology}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold leading-none">Starting At</span>
                      <span className="text-lg sm:text-2xl font-black text-white">{featured.price}</span>
                    </div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-sm group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Launch List Feed (Takes 5 cols on desktop, responsive stack on mobile) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3">
              {listItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    window.location.href = `/view-details/${item.id}`;
                  }}
                  className="group bg-slate-800/60 hover:bg-slate-800 rounded-xl p-3 border border-slate-700/60 hover:border-slate-500 transition-all duration-200 cursor-pointer flex gap-3 items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="100px"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                      #{idx + 2}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] uppercase font-bold text-brand-teal truncate">
                        {item.developer}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-300 bg-slate-700/60 px-1.5 py-0.5 rounded shrink-0">
                        {item.typology}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-brand-red transition-colors">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                      <span>📍 {item.location}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-700/50">
                      <span className="text-xs sm:text-sm font-black text-amber-400">
                        {item.price}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 group-hover:text-white flex items-center gap-0.5">
                        Details <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
