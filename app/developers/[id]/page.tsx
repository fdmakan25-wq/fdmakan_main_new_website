'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import SafeImage from '@/components/SafeImage';

interface Developer {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  establishedYear?: number;
  totalProjects?: number;
  rating?: number;
}

interface Property {
  _id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  available: boolean;
  images: string[];
  videos?: string[];
}

export default function DeveloperDetailsPage() {
  const params = useParams();
  const developerId = params.id as string;
  
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (developerId) {
      fetchDeveloper();
      fetchProperties();
    }
  }, [developerId]);

  const fetchDeveloper = async () => {
    try {
      const response = await fetch(`/api/developers/${developerId}`);
      if (response.ok) {
        const data = await response.json();
        setDeveloper(data);
      }
    } catch (error) {
      console.error('Error fetching developer:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const allProperties = await response.json();
        // Filter properties by developer name
        if (developer) {
          const developerProperties = allProperties.filter((prop: Property) => 
            prop.developer === developer.name
          );
          setProperties(developerProperties);
        }
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (developer) {
      fetchProperties();
    }
  }, [developer]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Developer not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Developer Header Section */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Developer Logo */}
            <div className="flex-shrink-0">
              {developer.logo ? (
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center p-6 shadow-lg">
                  <SafeImage
                    src={developer.logo}
                    alt={developer.name}
                    width={200}
                    height={200}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gradient-to-br from-brand-teal to-brand-red rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-2xl text-center px-4">
                    {developer.name.toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Developer Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {developer.name}
              </h1>
              
              {developer.rating && (
                <div className="flex items-center justify-center md:justify-start mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${star <= (developer.rating || 5) ? 'text-orange-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-gray-600">
                {developer.establishedYear && (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Est. {developer.establishedYear}
                  </span>
                )}
                {developer.totalProjects && (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {developer.totalProjects} Projects
                  </span>
                )}
                {developer.website && (
                  <a
                    href={developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-brand-red hover:text-brand-red-dark transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                )}
              </div>

              {/* Description */}
              {developer.description && (
                <div className="mt-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {developer.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Properties by {developer.name}
          </h2>

          {properties.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">
                This developer doesn't have any listed properties yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

