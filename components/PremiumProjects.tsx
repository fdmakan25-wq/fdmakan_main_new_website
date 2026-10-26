'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import { formatPropertyPrice } from '@/lib/property-details-display';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';

interface DisplayProject {
  id: string;
  name: string;
  price: string;
  typology: string;
  location: string;
  description: string;
  image: string;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop';

export default function PremiumProjects() {
  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();
        const premiumProperties = data.filter((prop: { showInPremium?: boolean }) => prop.showInPremium === true);

        const formatted: DisplayProject[] = premiumProperties.slice(0, 5).map(
          (prop: {
            _id: string;
            name: string;
            price: number;
            bedrooms?: number;
            propertyType?: string;
            listingFor?: string;
            location: string;
            description?: string;
            images?: string[];
            pricing?: Array<{ price?: string }>;
          }) => ({
            id: prop._id,
            name: prop.name.toUpperCase(),
            price: formatPropertyPrice(prop.price, prop.listingFor, prop.pricing),
            typology: prop.bedrooms
              ? `${prop.bedrooms} BHK`
              : getPropertyTypeLabel(prop.propertyType || '') || 'Property',
            location: prop.location,
            description: prop.description || '',
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
  }, []);

  if (!loading && projects.length === 0) {
    return null;
  }

  const topProjects = projects.slice(0, 2);
  const bottomProjects = projects.slice(2, 5);

  return (
    <section className="py-7 md:py-9 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
            <span className="text-brand-red">Premium</span>
            <span className="text-gray-900 ml-3">Projects</span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading premium projects...</div>
        ) : (
          <div className="space-y-4">
            {topProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      window.location.href = `/view-details/${project.id}`;
                    }}
                    className="group relative h-[260px] md:h-[320px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute inset-0">
                      <SafeImage
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                      <div>
                        <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide mb-1">
                          {project.name}
                        </h3>
                        <div className="h-0.5 bg-brand-red w-12 group-hover:w-full transition-all duration-500 ease-out mb-2" />
                        {project.description && (
                          <p className="text-white/90 text-xs md:text-sm max-w-md leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="text-white space-y-1">
                          <div className="text-base md:text-lg font-bold text-white">{project.price}</div>
                          <div className="text-xs text-white/80">{project.typology} • {project.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bottomProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bottomProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      window.location.href = `/view-details/${project.id}`;
                    }}
                    className="group relative h-[230px] md:h-[260px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute inset-0">
                      <SafeImage
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div>
                        <h3 className="text-white text-base md:text-lg font-bold uppercase tracking-wide mb-1">
                          {project.name}
                        </h3>
                        <div className="h-0.5 bg-brand-red w-8 group-hover:w-full transition-all duration-500 ease-out mb-2" />
                        {project.description && (
                          <p className="text-white/90 text-[11px] max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="text-white space-y-0.5">
                          <div className="text-sm font-bold">{project.price}</div>
                          <div className="text-[11px] text-white/80">{project.typology} • {project.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
