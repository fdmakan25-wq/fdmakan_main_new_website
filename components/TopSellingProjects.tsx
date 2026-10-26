'use client';

import { useState, useEffect, useCallback } from 'react';
import SafeImage from '@/components/SafeImage';
import { formatPropertyPrice } from '@/lib/property-details-display';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';

interface TopSellingProject {
  id: string;
  name: string;
  developer: string;
  price: string;
  typology: string;
  location: string;
  image: string;
  soldPercentage?: number;
  unitsLeft?: number;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop';

export default function TopSellingProjects() {
  const [projects, setProjects] = useState<TopSellingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  // Responsive visible count tracking
  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
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
    const fetchTopSelling = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();
        const filtered = data.filter(
          (prop: { showInTopSelling?: boolean }) => prop.showInTopSelling === true
        );

        const formatted: TopSellingProject[] = filtered.map(
          (
            prop: {
              _id: string;
              name: string;
              developer?: string;
              price: number;
              bedrooms?: number;
              propertyType?: string;
              listingFor?: string;
              location: string;
              images?: string[];
              pricing?: Array<{ price?: string }>;
            },
            index: number
          ) => {
            const seedPercentages = [92, 88, 95, 85, 90, 87];
            const soldPercentage = seedPercentages[index % seedPercentages.length];
            const unitsLeft = Math.max(2, 100 - soldPercentage);

            return {
              id: prop._id,
              name: prop.name,
              developer: prop.developer || 'Reputed Builder',
              price: formatPropertyPrice(prop.price, prop.listingFor, prop.pricing),
              typology: prop.bedrooms
                ? `${prop.bedrooms} BHK`
                : getPropertyTypeLabel(prop.propertyType || '') || 'Luxury Residence',
              location: prop.location,
              image: prop.images?.[0] || PLACEHOLDER_IMAGE,
              soldPercentage,
              unitsLeft,
            };
          }
        );

        setProjects(formatted);
      } catch (error) {
        console.error('Error fetching top selling:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  const maxIndex = Math.max(0, projects.length - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  if (!loading && projects.length === 0) return null;

  return (
    <section className="py-7 md:py-10 bg-gradient-to-b from-amber-50/40 via-white to-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-7 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full mb-2 border border-amber-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Fastest Selling Properties</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Top Selling <span className="text-brand-red">Developments</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              High investor demand & fast-moving inventory across prime locations
            </p>
          </div>

          {projects.length > visibleCount && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={prevSlide}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 text-gray-700 transition active:scale-95"
                aria-label="Previous"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 text-gray-700 transition active:scale-95"
                aria-label="Next"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Carousel Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden py-1">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                }}
              >
                {projects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="flex-shrink-0 px-2 sm:px-2.5"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div
                      onClick={() => {
                        window.location.href = `/view-details/${project.id}`;
                      }}
                      className="group bg-white rounded-2xl border border-amber-200/80 hover:border-brand-red/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative"
                    >
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-500 to-brand-red text-white text-[11px] font-black flex items-center justify-center shadow-md">
                            #{idx + 1}
                          </span>
                          <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30">
                            {project.soldPercentage}% SOLD
                          </span>
                        </div>
                        <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/60 shadow-2xs">
                          {project.typology}
                        </span>
                      </div>

                      {/* Photo Header */}
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                        <SafeImage
                          src={project.image}
                          alt={project.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                        {/* Title & Developer Banner */}
                        <div className="absolute bottom-2.5 left-3 right-3">
                          <span className="text-[10px] font-semibold text-amber-200 uppercase tracking-wide truncate block">
                            {project.developer}
                          </span>
                          <h3 className="text-white font-bold text-sm sm:text-base leading-snug truncate group-hover:text-amber-100 transition-colors drop-shadow-sm">
                            {project.name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="font-semibold text-slate-700 flex items-center gap-1 truncate">
                              <svg className="w-3.5 h-3.5 text-brand-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate">{project.location}</span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                              0% Brokerage
                            </span>
                          </div>

                          {/* Inventory Demand Bar */}
                          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                            <div className="flex justify-between items-center text-[10px] sm:text-[11px] mb-1 font-semibold">
                              <span className="text-amber-900">Bookings Demand</span>
                              <span className="font-black text-brand-red">
                                Only {project.unitsLeft} units left
                              </span>
                            </div>
                            <div className="w-full h-1.5 sm:h-2 bg-amber-200/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-brand-red rounded-full transition-all duration-700"
                                style={{ width: `${project.soldPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                              Starting Price
                            </span>
                            <span className="text-base sm:text-lg font-black text-gray-900 leading-none">
                              {project.price}
                            </span>
                          </div>
                          <span className="px-3 py-1.5 bg-slate-900 group-hover:bg-brand-red text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1 shrink-0">
                            Explore <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile / Desktop Pagination Dots */}
            {projects.length > visibleCount && (
              <div className="flex items-center justify-center mt-5 sm:mt-6 space-x-1.5">
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
