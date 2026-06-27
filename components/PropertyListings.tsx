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
}

// Demo properties (fallback)
const demoProperties = [
  {
    id: 1,
    title: "Modern Family Home",
    location: "Downtown, City",
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
    type: "House"
  },
  {
    id: 2,
    title: "Luxury Apartment",
    location: "Riverside District",
    price: 320000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    type: "Apartment"
  },
  {
    id: 3,
    title: "Cozy Studio",
    location: "City Center",
    price: 180000,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    type: "Studio"
  },
  {
    id: 4,
    title: "Spacious Villa",
    location: "Suburban Area",
    price: 680000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
    type: "Villa"
  },
  {
    id: 5,
    title: "Downtown Loft",
    location: "Business District",
    price: 280000,
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    type: "Loft"
  },
  {
    id: 6,
    title: "Beachfront Condo",
    location: "Coastal Area",
    price: 550000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    type: "Condo"
  },
];

export default function PropertyListings() {
  const [databaseProperties, setDatabaseProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        // Convert database properties to PropertyCard format
        const formatted = data.map((prop: {
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
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
          images: prop.images,
          type: prop.subCategory || prop.type || 'Property',
          listingFor: prop.listingFor,
          propertyType: prop.propertyType,
          pricing: prop.pricing,
        }));
        setDatabaseProperties(formatted);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Merge database properties with demo data (database first, then demo)
  const allProperties = [
    ...databaseProperties,
    ...demoProperties
  ];

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
          ) : allProperties.length > 0 ? (
            allProperties.map((property) => (
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

