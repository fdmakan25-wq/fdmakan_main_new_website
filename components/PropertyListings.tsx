'use client';

import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';

interface Property {
  id?: string | number;
  _id?: string;
  title: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
  images?: string[];
  type?: string;
  subCategory?: string;
  listingFor?: string;
  propertyType?: string;
  pricing?: Array<{ price?: string }>;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop';

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();
        const formatted = data.map(
          (prop: {
            _id: string;
            name?: string;
            title?: string;
            location: string;
            price: number;
            bedrooms?: number;
            bathrooms?: number;
            area?: number;
            images?: string[];
            subCategory?: string;
            type?: string;
            listingFor?: string;
            propertyType?: string;
            pricing?: Array<{ price?: string }>;
          }) => ({
            id: prop._id,
            _id: prop._id,
            title: prop.name || prop.title || 'Property',
            location: prop.location,
            price: prop.price,
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
            area: prop.area || 0,
            image: prop.images?.[0] || PLACEHOLDER_IMAGE,
            images: prop.images,
            type: prop.subCategory || prop.type || 'Property',
            listingFor: prop.listingFor,
            propertyType: prop.propertyType,
            pricing: prop.pricing,
          })
        );
        setProperties(formatted);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-brand-red/10 rounded-full mb-6">
            <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Featured Properties</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Discover Your <span className="gradient-text">Dream Home</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our handpicked selection of premium properties designed to meet your lifestyle needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">No properties available</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
