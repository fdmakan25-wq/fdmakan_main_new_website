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
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold flex items-center">
            <span className="text-brand-red">Premium</span>
            <span className="text-gray-900 ml-4">Projects</span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading premium projects...</div>
        ) : (
          <div className="space-y-6">
            {topProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      window.location.href = `/view-details/${project.id}`;
                    }}
                    className="group relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0">
                      <SafeImage
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                      <div>
                        <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                          {project.name}
                        </h3>
                        <div className="h-1 bg-brand-red w-0 group-hover:w-full transition-all duration-500 ease-out mb-3" />
                        {project.description && (
                          <p className="text-white/90 text-sm md:text-base max-w-md leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="text-white space-y-2">
                          <div className="text-lg font-semibold">{project.price}</div>
                          <div className="text-sm">{project.typology}</div>
                          <div className="text-sm">{project.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bottomProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bottomProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      window.location.href = `/view-details/${project.id}`;
                    }}
                    className="group relative h-[350px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0">
                      <SafeImage
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <div>
                        <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide mb-2">
                          {project.name}
                        </h3>
                        <div className="h-1 bg-brand-red w-0 group-hover:w-full transition-all duration-500 ease-out mb-3" />
                        {project.description && (
                          <p className="text-white/90 text-xs md:text-sm max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="text-white space-y-1">
                          <div className="text-base font-semibold">{project.price}</div>
                          <div className="text-xs">{project.typology}</div>
                          <div className="text-xs">{project.location}</div>
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
