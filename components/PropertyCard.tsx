'use client';

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { formatPropertyPrice, getListingBadgeLabel } from '@/lib/property-details-display';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';

interface Property {
  id?: string | number;
  _id?: string;
  title?: string;
  name?: string;
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

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const displayTitle = property.name || property.title || 'Property';
  const displayId = property._id || String(property.id);
  const displayImage = (property.images && property.images.length > 0)
    ? property.images[0]
    : property.image || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop";
  const typeLabel = property.propertyType
    ? getPropertyTypeLabel(property.propertyType)
    : property.subCategory || property.type || 'Property';
  const listingBadge = property.listingFor ? getListingBadgeLabel(property.listingFor) : null;
  const displayPrice = formatPropertyPrice(property.price, property.listingFor, property.pricing);
  const showBedBath = (property.bedrooms ?? 0) > 0 || (property.bathrooms ?? 0) > 0 || (property.area ?? 0) > 0;

  return (
    <Link
      href={`/view-details/${displayId}`}
      className="premium-card overflow-hidden group block cursor-pointer"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <SafeImage
          src={displayImage}
          alt={displayTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
          {listingBadge && (
            <span className="bg-brand-red/95 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
              {listingBadge}
            </span>
          )}
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
            {typeLabel}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-red transition-colors">{displayTitle}</h3>
        <p className="text-gray-600 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>
        {showBedBath && (
          <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-100">
            {(property.bedrooms ?? 0) > 0 && (
              <span className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-semibold">{property.bedrooms}</span>
              </span>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <span className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">{property.bathrooms}</span>
              </span>
            )}
            {(property.area ?? 0) > 0 && (
              <span className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-semibold px-1">{property.area}</span>
                <span className="text-xs">sqft</span>
              </span>
            )}
          </div>
        )}
        <div className={`flex items-center justify-between${showBedBath ? '' : ' pt-2'}`}>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">
              {displayPrice}
            </div>
          </div>
          <span className="inline-flex bg-brand-red text-white px-6 py-2 rounded-xl font-bold group-hover:bg-brand-red-dark transition-all shadow-soft-md group-hover:shadow-glow transform group-hover:-translate-y-1 text-sm">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
