'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop';

interface HeroBanner {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
}

const DEFAULT_BANNERS: HeroBanner[] = [
  {
    title: 'Find Your Dream Home With Us',
    subtitle: 'Discover premium properties across India. Your perfect home is just a click away with FD MAKAN.',
    image: HERO_IMAGE,
  },
];

export default function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const targetProgress = useRef(0);
  const smoothProgress = useRef(0);
  const rafId = useRef<number>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: 'property' | 'developer' }[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>(DEFAULT_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const updateScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      targetProgress.current = 0;
      return;
    }
    const rect = el.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    targetProgress.current = easeOutCubic(scrolled / scrollable);
  }, []);

  useEffect(() => {
    const animate = () => {
      const diff = targetProgress.current - smoothProgress.current;
      if (Math.abs(diff) > 0.0005) {
        smoothProgress.current += diff * 0.11;
        setScrollProgress(smoothProgress.current);
      }
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateScroll]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const properties = await res.json();
          const uniqueLocations = Array.from(
            new Set(properties.map((p: { location: string }) => p.location))
          ).filter(Boolean) as string[];
          setLocations(uniqueLocations.sort());
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners?active=true', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setBanners(data);
            setCurrentSlide(0);
          }
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const [propsRes, devRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/developers'),
      ]);

      if (propsRes.ok && devRes.ok) {
        const properties = await propsRes.json();
        const developers = await devRes.json();

        const filteredProps = properties
          .filter((p: { name: string }) => p.name.toLowerCase().includes(query.toLowerCase()))
          .map((p: { _id: string; name: string }) => ({ id: p._id, name: p.name, type: 'property' as const }));

        const filteredDevs = developers
          .filter((d: { name: string }) => d.name.toLowerCase().includes(query.toLowerCase()))
          .map((d: { _id: string; name: string }) => ({ id: d._id, name: d.name, type: 'developer' as const }));

        setSearchResults([...filteredProps, ...filteredDevs].slice(0, 5));
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleFindNow = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedArea) params.set('location', selectedArea);
    if (selectedStatus) params.set('status', selectedStatus);
    if (selectedType) params.set('type', selectedType);
    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ''}`);
  };

  const scale = 1 - scrollProgress * 0.1;
  const inset = scrollProgress * 28;
  const radius = scrollProgress * 32;
  const lift = scrollProgress * -24;
  const currentBanner = banners[currentSlide] || banners[0];

  return (
    <section ref={sectionRef} className="relative h-[165vh] bg-[#111827]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden will-change-transform transition-[border-radius,margin,width] duration-150 ease-out"
        style={{
          transform: `translateY(${lift}px) scale(${scale})`,
          transformOrigin: 'center top',
          borderRadius: `${radius}px`,
          marginLeft: `${inset}px`,
          marginRight: `${inset}px`,
          width: `calc(100% - ${inset * 2}px)`,
        }}
      >
        {/* Sliding backgrounds */}
        {banners.map((banner, index) => (
          <Image
            key={banner._id || `banner-${index}`}
            src={banner.image}
            alt={banner.title}
            fill
            priority={index === 0}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="100vw"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col container mx-auto px-6 md:px-10 max-w-7xl pt-20 pb-6 md:pb-8">
          {/* Main headline block */}
          <div className="flex-1 flex flex-col justify-center min-h-0 py-4 md:py-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest mb-5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
                Seal The Deal • Premium Real Estate
              </span>

              <h1
                key={`title-${currentSlide}`}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                {currentBanner.title}
              </h1>

              <p
                key={`subtitle-${currentSlide}`}
                className="text-white/75 text-base md:text-lg leading-relaxed mb-7 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
              >
                {currentBanner.subtitle}
              </p>

              {banners.length > 1 && (
                <div className="flex items-center gap-2 mb-6">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'w-8 bg-accent-orange' : 'w-3 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                  <span className="text-white/40 text-xs ml-2 tabular-nums">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/properties"
                  className="bg-accent-orange text-white px-8 py-3.5 rounded-full font-bold hover:bg-accent-orange/90 transition shadow-lg hover:shadow-accent hover:-translate-y-0.5"
                >
                  Explore Properties
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white border border-white/40 hover:bg-white/10 transition backdrop-blur-sm"
                >
                  Contact Us
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats + filter — stacked, never overlapping */}
          <div className="shrink-0 space-y-5 md:space-y-6">
            <div className="flex flex-wrap gap-6 sm:gap-10 md:gap-14 hero-text-delay-3">
              {[
                { value: '500+', label: 'Properties' },
                { value: '50+', label: 'Developers' },
                { value: '10K+', label: 'Happy Clients' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[11px] md:text-xs text-white/50 uppercase tracking-widest font-semibold mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Search / filter bar */}
            <div className="w-full">
              <div className="bg-gradient-to-r from-brand-red via-brand-red-light to-brand-red rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20 backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
              <div className="relative">
                <label className="text-xs font-semibold text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Properties, Developers..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFindNow()}
                  className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-gray-900 bg-white font-medium text-sm"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        type="button"
                        onClick={() => {
                          window.location.href = result.type === 'property'
                            ? `/view-details/${result.id}`
                            : `/developers/${result.id}`;
                        }}
                        className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 text-left"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${result.type === 'property' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-teal/10 text-brand-teal'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
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

              <div>
                <label className="text-xs font-semibold text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Choose Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-900 bg-white font-medium text-sm appearance-none"
                >
                  <option value="">Select Area</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Property Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-900 bg-white font-medium text-sm appearance-none"
                >
                  <option value="">All Properties</option>
                  <option value="newly-launched">Newly Launched</option>
                  <option value="top-selling">Top Selling</option>
                  <option value="top-picks">Top Picks</option>
                  <option value="premium">Premium Projects</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-900 bg-white font-medium text-sm appearance-none"
                >
                  <option value="">Select Type</option>
                  <option value="1rk">1 RK</option>
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk">2 BHK</option>
                  <option value="3bhk">3 BHK</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleFindNow}
                  className="w-full bg-white text-brand-red px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-xl flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find Now
                </button>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-2 right-6 md:right-10 z-10 flex flex-col items-center gap-1 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
        >
          <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
          <svg className="w-4 h-4 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
