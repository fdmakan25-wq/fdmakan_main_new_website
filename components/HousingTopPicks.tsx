'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { formatPropertyPrice } from '@/lib/property-details-display';

interface TopPickProject {
  id: string;
  developerName: string;
  projectName: string;
  location: string;
  price: string;
  apartmentTypes: string;
  specialOffer?: string;
  image: string;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop';

function TopPickCard({ project, inGrid = false }: { project: TopPickProject; inGrid?: boolean }) {
  return (
    <article className={`${inGrid ? 'w-full' : 'w-[260px] sm:w-[290px] md:w-[310px] flex-shrink-0 mx-2'} bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 group flex flex-col h-full overflow-hidden`}>
      {/* Visual Image Header */}
      <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
        <SafeImage
          src={project.image}
          alt={project.projectName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="bg-gradient-to-r from-brand-red to-orange-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {project.specialOffer || 'Featured'}
          </span>
          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 border border-white/50">
            <svg className="w-3 h-3 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        </div>

        {/* Project & Developer Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
          <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-medium tracking-wide mb-0.5">
            <svg className="w-3 h-3 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{project.developerName}</span>
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base leading-snug truncate drop-shadow-sm group-hover:text-amber-200 transition-colors">
            {project.projectName}
          </h3>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white space-y-3">
        <div className="space-y-2">
          {/* Location row */}
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
              <svg className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate font-semibold text-slate-700">{project.location}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
              Verified
            </span>
          </div>

          {/* Typology / Configurations Badge - Clean Full Width Pill */}
          {project.apartmentTypes && (
            <div className="flex items-center gap-1.5 bg-teal-50/90 border border-teal-200/70 text-teal-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              <svg className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="truncate" title={project.apartmentTypes}>
                {project.apartmentTypes}
              </span>
            </div>
          )}

          {/* Pricing Highlight Box */}
          <div className="bg-slate-50/90 rounded-xl p-2.5 flex items-baseline justify-between border border-slate-100">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Starting From</span>
              <div className="text-brand-red font-black text-lg tracking-tight leading-none mt-0.5">{project.price}</div>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-2xs border border-slate-200 shrink-0">
              EMI Available
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/view-details/${project.id}`}
          className="w-full py-2 bg-slate-900 group-hover:bg-brand-red text-white text-xs font-bold rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-brand-red/20 active:scale-[0.98]"
        >
          <span>Explore Property</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}


export default function HousingTopPicks() {
  const [projects, setProjects] = useState<TopPickProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setVisibleCount(4);
      } else if (width >= 1024) {
        setVisibleCount(3);
      } else if (width >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();

        const flagged = data.filter(
          (p: { showInTopSelling?: boolean; showInPremium?: boolean }) =>
            p.showInTopSelling || p.showInPremium
        );
        const source = flagged.length > 0 ? flagged : data;

        const formatted: TopPickProject[] = source.map(
          (prop: {
            _id: string;
            developer?: string;
            name: string;
            location: string;
            price: number;
            listingFor?: string;
            pricing?: Array<{ type?: string; price?: string }>;
            showInPremium?: boolean;
            images?: string[];
          }) => ({
            id: prop._id,
            developerName: prop.developer || 'Developer',
            projectName: prop.name,
            location: prop.location,
            price: formatPropertyPrice(prop.price, prop.listingFor, prop.pricing),
            apartmentTypes: prop.pricing?.length
              ? prop.pricing.map((p) => p.type).filter(Boolean).join(', ')
              : 'Premium Homes',
            specialOffer: prop.showInPremium ? 'Premium Pick' : undefined,
            image: prop.images?.[0] || PLACEHOLDER_IMAGE,
          })
        );

        setProjects(formatted);
      } catch (error) {
        console.error('Error fetching top picks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const maxIndex = Math.max(0, projects.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  if (!loading && projects.length === 0) {
    return null;
  }

  return (
    <section className="py-7 md:py-9 bg-gradient-to-b from-gray-50/60 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header with Title and Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-brand-teal/10 text-brand-teal text-[11px] font-bold uppercase tracking-widest rounded-full mb-1.5">
              Curated For You
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              FD MAKAN&apos;s <span className="text-brand-red">Top Picks</span>
            </h2>
            <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
              Handpicked premium projects — explore top living options with us.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/properties"
              className="hidden sm:inline-flex items-center gap-1.5 text-navy-blue font-bold hover:text-brand-teal transition text-xs mr-2"
            >
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {projects.length > visibleCount && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red text-gray-700 transition-all duration-200 cursor-pointer"
                  aria-label="Previous Top Pick"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red text-gray-700 transition-all duration-200 cursor-pointer"
                  aria-label="Next Top Pick"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10 text-gray-400">Loading top picks...</div>
        ) : (
          <div className="relative">
            {/* Slider Viewport */}
            <div className="overflow-hidden py-1">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex-shrink-0 px-2 sm:px-2.5"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <TopPickCard project={project} inGrid={true} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            {projects.length > visibleCount && (
              <div className="flex items-center justify-center mt-5 space-x-1.5">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-6 bg-brand-red' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
