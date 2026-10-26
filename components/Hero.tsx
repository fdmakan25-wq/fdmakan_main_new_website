'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SafeImage from '@/components/SafeImage';
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
    <section ref={sectionRef} id="hero-section" className="relative min-h-screen lg:h-[165vh] bg-[#111827]">
      <div
        className="relative lg:sticky top-0 min-h-screen lg:h-screen w-full overflow-hidden will-change-transform transition-[border-radius,margin,width] duration-150 ease-out"
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
          <SafeImage
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

        {/* Hero content */}
        <div className="relative z-10 min-h-screen lg:h-full flex flex-col justify-between container mx-auto px-4 sm:px-6 md:px-10 max-w-7xl pt-28 sm:pt-32 pb-8 md:pb-10">
          {/* Main headline block */}
          <div className="flex-1 flex flex-col justify-center min-h-0 py-4 md:py-6">
            <div className="max-w-2xl py-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
                Seal The Deal • Premium Real Estate
              </span>

              <h1
                key={`title-${currentSlide}`}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-3 sm:mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                {currentBanner.title}
              </h1>

              <p
                key={`subtitle-${currentSlide}`}
                className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-7 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100"
              >
                {currentBanner.subtitle}
              </p>

              {banners.length > 1 && (
                <div className="flex items-center gap-2 mb-5">
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
                <Link
                  href="/properties"
                  className="bg-accent-orange text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold hover:bg-accent-orange/90 transition shadow-lg hover:shadow-accent text-center active:scale-95"
                >
                  Explore Properties
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold text-white border border-white/40 hover:bg-white/10 transition backdrop-blur-sm text-center active:scale-95"
                >
                  <span>Contact Us</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats + filter — stacked, never overlapping */}
          <div className="shrink-0 space-y-4 md:space-y-6 pt-2">
            <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-lg">
              {[
                { value: '500+', label: 'Properties' },
                { value: '50+', label: 'Developers' },
                { value: '10K+', label: 'Happy Clients' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm sm:bg-transparent p-2 sm:p-0 rounded-xl text-center sm:text-left border border-white/10 sm:border-0">
                  <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider font-semibold mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>


            {/* Search / filter bar */}
            <div className="w-full">
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border border-white/15">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  <div className="relative sm:col-span-2 lg:col-span-1">
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-white/80 mb-1.5 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </label>
                    <input
                      type="text"
                      placeholder="Project or Developer..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleFindNow()}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-gray-900 text-white placeholder-white/50 border border-white/15 focus:border-accent-orange focus:outline-none transition-all duration-200 text-sm font-medium"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-full min-w-[260px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-100">
                        {searchResults.map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            type="button"
                            onClick={() => {
                              window.location.href = result.type === 'property'
                                ? `/view-details/${result.id}`
                                : `/developers/${result.id}`;
                            }}
                            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition text-left"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${result.type === 'property' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-teal/10 text-brand-teal'}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold text-gray-900 truncate">{result.name}</div>
                              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{result.type}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-white/80 mb-1.5 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Location
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-gray-900 text-white border border-white/15 focus:border-accent-orange focus:outline-none transition-all duration-200 text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900 bg-white">All Locations</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc} className="text-gray-900 bg-white">{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-white/80 mb-1.5 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-gray-900 text-white border border-white/15 focus:border-accent-orange focus:outline-none transition-all duration-200 text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900 bg-white">All Status</option>
                      <option value="newly-launched" className="text-gray-900 bg-white">Newly Launched</option>
                      <option value="top-selling" className="text-gray-900 bg-white">Top Selling</option>
                      <option value="top-picks" className="text-gray-900 bg-white">Top Picks</option>
                      <option value="premium" className="text-gray-900 bg-white">Premium Projects</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-white/80 mb-1.5 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Typology
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-gray-900 text-white border border-white/15 focus:border-accent-orange focus:outline-none transition-all duration-200 text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-900 bg-white">Any Typology</option>
                      <option value="1rk" className="text-gray-900 bg-white">1 RK</option>
                      <option value="1bhk" className="text-gray-900 bg-white">1 BHK</option>
                      <option value="2bhk" className="text-gray-900 bg-white">2 BHK</option>
                      <option value="3bhk" className="text-gray-900 bg-white">3 BHK</option>
                    </select>
                  </div>

                  <div className="flex items-end sm:col-span-2 lg:col-span-1">
                    <button
                      type="button"
                      onClick={handleFindNow}
                      className="w-full bg-gradient-to-r from-accent-orange to-brand-red text-white hover:from-brand-red hover:to-brand-red-dark py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-accent flex items-center justify-center gap-2 uppercase tracking-wider group"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
