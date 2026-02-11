'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: 'property' | 'developer' }[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const properties = await res.json();
          const uniqueLocations = Array.from(new Set(properties.map((p: any) => p.location))).filter(Boolean) as string[];
          setLocations(uniqueLocations.sort());
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const [propsRes, devRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/developers')
      ]);

      if (propsRes.ok && devRes.ok) {
        const properties = await propsRes.json();
        const developers = await devRes.json();

        const filteredProps = properties
          .filter((p: any) => p.name.toLowerCase().includes(query.toLowerCase()))
          .map((p: any) => ({ id: p._id, name: p.name, type: 'property' as const }));

        const filteredDevs = developers
          .filter((d: any) => d.name.toLowerCase().includes(query.toLowerCase()))
          .map((d: any) => ({ id: d._id, name: d.name, type: 'developer' as const }));

        setSearchResults([...filteredProps, ...filteredDevs].slice(0, 5));
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Real Image Content - Same image for all banners
  const RealImageContent = () => (
    <div className="relative hidden lg:block">
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden house-image-container">
        <Image
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Luxury Residential Towers"
          fill
          className="object-cover rounded-2xl"
        />
      </div>
    </div>
  );

  // Text Content Components with different slogans for each banner
  const TextContent1 = () => (
    <div className="relative z-10">
      <h1 className="text-5xl md:text-6xl font-bold text-navy-blue mb-6 leading-tight hero-text-animate">
        Find Your Dream House By Us
      </h1>
      <p className="text-gray-600 mb-8 text-lg leading-relaxed hero-text-delay-1">
        Discover premium properties that match your lifestyle. Your perfect home is just a click away with FD MAKAN.
      </p>
      <div className="flex items-center space-x-4 mb-12 hero-text-delay-2">
        <button className="bg-brand-red text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-red-dark transition shadow-soft-md hover:shadow-glow transform hover:-translate-y-1">
          Make An Enquiry
        </button>
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-soft-md hover:shadow-lg transition text-brand-red hover:bg-brand-red hover:text-white border border-gray-100">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );

  // Single banner - Banner 1 only (slider functionality ready for more banners later)
  const banners = [
    // Banner 1: Text Left, Image Right
    <div key="banner1" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4" style={{ width: '100%' }}>
      <TextContent1 />
      <RealImageContent />
    </div>
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % banners.length;
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev - 1 + banners.length) % banners.length;
      return next;
    });
  };

  // Auto-play slider - changes slide every 5 seconds (only if more than 1 banner)
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  return (
    <section className="bg-gray-50 relative overflow-hidden pb-12">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="relative">
          {/* Floating Banner Container */}
          <div className="relative bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 mx-auto max-w-7xl">
            {/* Slider Container Inside Banner */}
            <div className="relative overflow-hidden w-full" style={{ minHeight: '500px' }}>
              <div
                className="flex"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.7s ease-in-out',
                  width: `${banners.length * 100}%`
                }}
              >
                {banners.map((banner, index) => (
                  <div
                    key={`banner-${index}`}
                    className="flex-shrink-0"
                    style={{
                      width: `${100 / banners.length}%`,
                      flexBasis: `${100 / banners.length}%`
                    }}
                  >
                    {banner}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Inside Banner (only show if more than 1 banner) */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  type="button"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white bg-opacity-80 rounded-full shadow-xl flex items-center justify-center hover:bg-opacity-100 transition z-30 hover:scale-110 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6 text-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white bg-opacity-80 rounded-full shadow-xl flex items-center justify-center hover:bg-opacity-100 transition z-30 hover:scale-110 cursor-pointer"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6 text-navy-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Slide Indicators - Inside Banner */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      type="button"
                      className={`h-3 rounded-full transition-all cursor-pointer ${currentSlide === index
                        ? 'bg-brand-red w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-3'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search/Filter Bar - Positioned at bottom of hero section */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[95%] z-30">
          <div className="bg-gradient-to-r from-brand-red via-brand-red-light to-brand-red rounded-2xl shadow-soft-lg p-8 border-4 border-white/30 backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <label className="text-sm font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Properties, Developers..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 bg-white font-medium shadow-lg hover:shadow-xl transition-all"
                />

                {/* Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => window.location.href = result.type === 'property' ? `/view-details/${result.id}` : `/developers/${result.id}`}
                        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 text-left"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${result.type === 'property' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-teal/10 text-brand-teal'}`}>
                          {result.type === 'property' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 truncate">{result.name}</div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{result.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="text-sm font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Choose Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 appearance-none bg-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <option value="">Select Area</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="text-sm font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Property Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 appearance-none bg-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="for-sale">Sale</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-sm font-semibold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 appearance-none bg-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="1rk">1 RK</option>
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk">2 BHK</option>
                  <option value="3bhk">3 BHK</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-white text-brand-red px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 uppercase tracking-wide flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  FIND NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
