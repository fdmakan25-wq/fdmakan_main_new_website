'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
  demoProjects: Project[];
  sortByDate?: boolean;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      onClick={() => { window.location.href = `/view-details/${String(project.id)}`; }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-6 relative">
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-6 right-6 w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center hover:bg-brand-teal-dark transition shadow-md"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-3 pr-12">{project.name}</h3>
        <div className="text-brand-red font-semibold text-lg mb-3">{project.price}</div>
        <div className="text-gray-600 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {project.typology}
        </div>
        <div className="text-gray-600 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{project.location}</span>
        </div>
      </div>
    </div>
  );
}

export default function PropertyProjectsCarousel({
  titleHighlight,
  titleRest,
  filterKey,
  demoProjects,
  sortByDate = false,
}: PropertyProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
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

        const formatted: Project[] = filtered.map((prop: {
          _id: string;
          name: string;
          price: number;
          bedrooms?: number;
          location: string;
          images?: string[];
        }) => ({
          id: prop._id,
          name: prop.name,
          price: sortByDate
            ? `₹ ${(prop.price / 10000000).toFixed(1)}Cr${prop.price > 10000000 ? ` - ₹ ${((prop.price * 1.5) / 10000000).toFixed(1)}Cr` : ''}`
            : `₹ ${(prop.price / 10000000).toFixed(2)}Cr`,
          typology: prop.bedrooms ? `${prop.bedrooms} - ${prop.bedrooms + 1} Bed Apartment` : 'Property',
          location: prop.location,
          image: prop.images?.[0] || demoProjects[0].image,
        }));

        const merged = formatted.length > 0
          ? formatted
          : [...formatted, ...demoProjects.slice(formatted.length)];

        setProjects(merged.length >= 3 ? merged : [...merged, ...demoProjects].slice(0, Math.max(6, demoProjects.length)));
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [filterKey, sortByDate, demoProjects]);

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

  const progressWidth = maxIndex > 0 ? ((currentIndex / maxIndex) * 100) : 100;

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold flex items-center">
            <span className="text-brand-red">{titleHighlight}</span>
            <span className="text-gray-900 ml-4">{titleRest}</span>
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center mt-12 space-x-4">
            <div className="flex items-center space-x-2 w-36">
              <div
                className="h-1 bg-brand-red rounded transition-all duration-500"
                style={{ width: `${Math.max(20, progressWidth)}%` }}
              />
              <div className="flex-1 h-1 bg-gray-300 rounded" />
            </div>

            <button
              type="button"
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-brand-red hover:bg-brand-red/10 transition"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-brand-red hover:bg-brand-red/10 transition"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
