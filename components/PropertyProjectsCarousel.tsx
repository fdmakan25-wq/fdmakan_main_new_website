'use client';

import { useState, useEffect, useCallback } from 'react';
import SafeImage from '@/components/SafeImage';
import { formatPropertyPrice } from '@/lib/property-details-display';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';

interface Project {
  id: string | number;
  name: string;
  price: string;
  typology: string;
  location: string;
  image: string;
}

interface PropertyProjectsCarouselProps {
  titleHighlight: string;
  titleRest: string;
  filterKey: 'showInTopSelling' | 'showInNewlyLaunched';
  sortByDate?: boolean;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop';

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      onClick={() => {
        window.location.href = `/view-details/${String(project.id)}`;
      }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100/90 hover:border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col"
    >
      {/* Visual Image Container */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
        <SafeImage
          src={project.image}
          alt={project.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Soft natural multi-stop gradient without abrupt black cutoff */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {project.typology && (
            <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-white/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
              {project.typology}
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
              New
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: project.name, url: `/view-details/${String(project.id)}` }).catch(() => {});
                }
              }}
              className="w-7 h-7 bg-slate-900/50 hover:bg-brand-red text-white backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-white/20 pointer-events-auto"
              title="Share Project"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title placed naturally with breathable padding */}
        <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
          <p className="text-white text-base sm:text-lg font-bold leading-tight drop-shadow-md truncate group-hover:text-amber-200 transition-colors">
            {project.name}
          </p>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white space-y-3">
        <div className="space-y-2">
          {/* Location & Area pill */}
          <div className="flex items-center justify-between text-xs gap-2">
            <div className="text-slate-600 text-xs flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700 truncate">{project.location}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Ready to Move
            </span>
          </div>

          {/* Price Box */}
          <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-baseline justify-between border border-slate-100">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Starting From</span>
              <div className="text-brand-red font-black text-xl tracking-tight leading-none mt-0.5">{project.price}</div>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded">
              0% Brokerage
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-brand-red transition-colors">
          <span className="tracking-wide uppercase text-[10px]">View Full Details</span>
          <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-brand-red group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
            <span className="text-xs">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyProjectsCarousel({
  titleHighlight,
  titleRest,
  filterKey,
  sortByDate = false,
}: PropertyProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisible = () => setVisibleCount(window.innerWidth >= 768 ? 3 : 1);
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();
        let filtered = data.filter((prop: { [key: string]: boolean }) => prop[filterKey] === true);

        if (sortByDate) {
          filtered = filtered.sort((a: { createdAt?: string }, b: { createdAt?: string }) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
        }

        const formatted: Project[] = filtered.map(
          (prop: {
            _id: string;
            name: string;
            price: number;
            bedrooms?: number;
            propertyType?: string;
            listingFor?: string;
            location: string;
            images?: string[];
            pricing?: Array<{ price?: string }>;
          }) => ({
            id: prop._id,
            name: prop.name,
            price: formatPropertyPrice(prop.price, prop.listingFor, prop.pricing),
            typology: prop.bedrooms
              ? `${prop.bedrooms} BHK`
              : getPropertyTypeLabel(prop.propertyType || '') || 'Property',
            location: prop.location,
            image: prop.images?.[0] || PLACEHOLDER_IMAGE,
          })
        );

        setProjects(formatted);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filterKey, sortByDate]);

  const maxIndex = Math.max(0, projects.length - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (projects.length <= visibleCount) return;
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [projects.length, visibleCount, nextSlide]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const progressWidth = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 100;

  if (!loading && projects.length === 0) {
    return null;
  }

  return (
    <section className="py-7 md:py-9 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-brand-red bg-brand-red/10 px-2.5 py-0.5 rounded-full mb-1.5">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              <span className="text-brand-red">{titleHighlight}</span> {titleRest}
            </h2>
          </div>

          {projects.length > visibleCount && (
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={prevSlide}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red text-gray-700 transition-all duration-300"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-brand-red hover:text-white hover:border-brand-red text-gray-700 transition-all duration-300"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden py-2">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex-shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>

            {projects.length > visibleCount && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-brand-red' : 'w-2 bg-gray-300 hover:bg-gray-400'
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
