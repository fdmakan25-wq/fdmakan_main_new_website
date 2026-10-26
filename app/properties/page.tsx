'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';

interface PricingRow {
  type: string;
  carpetArea?: string;
  price?: string;
}

interface Property {
  _id: string;
  name: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  developer?: string;
  available?: boolean;
  listingFor?: string;
  propertyType?: string;
  pricing?: PricingRow[];
  showInTopSelling?: boolean;
  showInNewlyLaunched?: boolean;
  showInPremium?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  '1rk': '1 rk',
  '1bhk': '1 bhk',
  '2bhk': '2 bhk',
  '3bhk': '3 bhk',
};

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setLocationFilter(searchParams.get('location') || 'all');
    setStatusFilter(searchParams.get('status') || '');
    setTypeFilter(searchParams.get('type') || '');
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const locations = useMemo(() => {
    const unique = Array.from(new Set(properties.map((p) => p.location).filter(Boolean)));
    return unique.sort();
  }, [properties]);

  const matchesType = (property: Property, type: string) => {
    if (!type) return true;
    const label = TYPE_LABELS[type] || type;
    return property.pricing?.some((row) =>
      row.type?.toLowerCase().includes(label)
    );
  };

  const matchesStatus = (property: Property, status: string) => {
    if (!status) return true;
    if (status === 'newly-launched') return property.showInNewlyLaunched === true;
    if (status === 'top-selling') return property.showInTopSelling === true;
    if (status === 'top-picks') return property.showInPremium === true || property.showInTopSelling === true;
    if (status === 'premium') return property.showInPremium === true;
    return true;
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        !search ||
        property.name?.toLowerCase().includes(search.toLowerCase()) ||
        property.location?.toLowerCase().includes(search.toLowerCase()) ||
        property.developer?.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        locationFilter === 'all' || property.location === locationFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesStatus(property, statusFilter) &&
        matchesType(property, typeFilter)
      );
    });
  }, [properties, search, locationFilter, statusFilter, typeFilter]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (locationFilter && locationFilter !== 'all') params.set('location', locationFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (typeFilter) params.set('type', typeFilter);
    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ''}`);
  };

  const clearFilters = () => {
    setSearch('');
    setLocationFilter('all');
    setStatusFilter('');
    setTypeFilter('');
    router.push('/properties');
  };

  const hasActiveFilters = search || locationFilter !== 'all' || statusFilter || typeFilter;
  const activeFilterCount = [
    Boolean(search.trim()),
    locationFilter && locationFilter !== 'all',
    Boolean(statusFilter),
    Boolean(typeFilter),
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative bg-navy-blue overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-blue via-[#1e4a7a] to-brand-teal/30" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-red rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative py-16 md:py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-brand-teal text-sm font-semibold mb-4 border border-white/10">
              Explore Our Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              All Properties
            </h1>
            <p className="text-lg text-white/75 leading-relaxed">
              Browse our complete collection of premium residential projects across top locations.
            </p>
            {!loading && (
              <p className="mt-4 text-white/60 text-sm font-medium">
                {filteredProperties.length} of {properties.length} properties shown
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-gray-100 shadow-xs lg:sticky lg:top-[72px] lg:z-20">
        <div className="container mx-auto px-4 max-w-7xl py-3 md:py-4">
          {/* Mobile Filter Bar (Compact Search + Toggle Button) */}
          <div className="lg:hidden space-y-2.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search project, area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters();
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition text-xs sm:text-sm"
                />
              </div>

              {/* Filter Dropdown Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                  isMobileFilterOpen || activeFilterCount > 0
                    ? 'bg-navy-blue text-white border-navy-blue shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-brand-orange text-white text-[11px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileFilterOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Collapsible Mobile Dropdown Panel */}
            {isMobileFilterOpen && (
              <div className="pt-2 pb-1 border-t border-gray-100 mt-2 space-y-3 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium text-xs sm:text-sm focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none"
                    >
                      <option value="all">All Locations</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Collection / Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium text-xs sm:text-sm focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none"
                    >
                      <option value="">All Collections</option>
                      <option value="newly-launched">Newly Launched</option>
                      <option value="top-selling">Top Selling</option>
                      <option value="top-picks">Top Picks</option>
                      <option value="premium">Premium Projects</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Typology
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium text-xs sm:text-sm focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none"
                    >
                      <option value="">All Typologies</option>
                      <option value="1rk">1 RK</option>
                      <option value="1bhk">1 BHK</option>
                      <option value="2bhk">2 BHK</option>
                      <option value="3bhk">3 BHK</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      applyFilters();
                      setIsMobileFilterOpen(false);
                    }}
                    className="flex-1 py-2.5 bg-navy-blue text-white rounded-xl font-semibold hover:bg-brand-teal transition text-xs sm:text-sm shadow-sm"
                  >
                    Apply Filters
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        clearFilters();
                        setIsMobileFilterOpen(false);
                      }}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition text-xs sm:text-sm font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filter Bar (Horizontal Row, Sticky on Desktop) */}
          <div className="hidden lg:grid grid-cols-5 gap-3">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search name, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition text-sm"
              />
            </div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition text-sm cursor-pointer"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition text-sm cursor-pointer"
            >
              <option value="">All Collections</option>
              <option value="newly-launched">Newly Launched</option>
              <option value="top-selling">Top Selling</option>
              <option value="top-picks">Top Picks</option>
              <option value="premium">Premium Projects</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition text-sm cursor-pointer"
            >
              <option value="">All Typologies</option>
              <option value="1rk">1 RK</option>
              <option value="1bhk">1 BHK</option>
              <option value="2bhk">2 BHK</option>
              <option value="3bhk">3 BHK</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-navy-blue text-white rounded-xl font-semibold hover:bg-brand-teal transition text-sm"
              >
                Apply
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
                  <div className="h-72 bg-gray-200" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-10 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <>
              <p className="text-gray-500 text-sm font-medium mb-8">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={{
                      _id: property._id,
                      title: property.name,
                      location: property.location,
                      price: property.price,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      area: property.area,
                      images: property.images,
                      listingFor: property.listingFor,
                      propertyType: property.propertyType,
                      pricing: property.pricing,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {properties.length === 0 ? 'No properties yet' : 'No matching properties'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {properties.length === 0
                  ? 'Properties added from the dashboard will appear here.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2.5 bg-navy-blue text-white rounded-xl font-semibold hover:bg-brand-teal transition"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
