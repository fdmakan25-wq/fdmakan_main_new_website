'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

function NavLink({
  href,
  pathname,
  light,
  children,
}: {
  href: string;
  pathname: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={`relative flex items-center text-sm transition-all duration-300 group ${
        light
          ? isActive ? 'font-bold text-white' : 'font-medium text-white/85 hover:text-white'
          : isActive ? 'font-bold' : 'font-medium text-gray-700'
      }`}
    >
      <span
        className={`relative inline-block transition-all duration-300 ${
          light
            ? ''
            : isActive
              ? 'bg-gradient-to-r from-accent-orange via-brand-teal to-accent-orange bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient'
              : 'group-hover:bg-gradient-to-r group-hover:from-accent-orange group-hover:via-brand-teal group-hover:to-accent-orange group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-[length:200%_100%] group-hover:animate-gradient'
        }`}
      >
        {children}
      </span>
      <span
        className={`ml-0.5 text-[10px] inline-block origin-center transition-all duration-300 ${
          light ? 'text-white/70' : 'text-brand-teal'
        } ${isActive ? 'scale-125' : 'group-hover:animate-spin-slow'}`}
      >
        +
      </span>
    </Link>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; type: 'property' | 'developer' }[]>([]);
  const [solidNav, setSolidNav] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setSolidNav(true);
      return;
    }

    const onScroll = () => {
      setSolidNav(window.scrollY > window.innerHeight * 0.55);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

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

        setSearchResults([...filteredProps, ...filteredDevs].slice(0, 8));
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const lightNav = isHome && !solidNav;

  return (
    <header
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-500 overflow-visible ${
        lightNav
          ? 'bg-transparent shadow-none border-b border-transparent'
          : 'glass-morphism shadow-soft border-b border-white/20'
      }`}
    >
      <nav className="container mx-auto px-6 py-1 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-[4.75rem]">
          <Link href="/" className="flex items-center hover:opacity-90 transition shrink-0 p-0 m-0 leading-none">
            <Logo size="navbar" light={lightNav} />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" pathname={pathname} light={lightNav}>Home</NavLink>
            <NavLink href="/properties" pathname={pathname} light={lightNav}>Property</NavLink>
            <NavLink href="/blogs" pathname={pathname} light={lightNav}>Blogs</NavLink>
            <NavLink href="/pages" pathname={pathname} light={lightNav}>Services</NavLink>
            <NavLink href="/about" pathname={pathname} light={lightNav}>About</NavLink>
            <NavLink href="/contact" pathname={pathname} light={lightNav}>Contact</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-3 relative">
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}>
              <input
                type="text"
                placeholder="Search properties, developers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all text-sm"
                autoFocus={isSearchOpen}
              />
            </div>

            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) {
                  setSearchQuery('');
                  setSearchResults([]);
                }
              }}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition group z-10 ${
                lightNav
                  ? 'bg-white/15 border border-white/25 hover:bg-white/25 text-white'
                  : 'bg-white border border-gray-100 hover:border-brand-red hover:bg-brand-red/5 shadow-soft hover:shadow-glow text-gray-600'
              }`}
            >
              <svg className={`w-5 h-5 ${lightNav ? 'text-white' : 'text-gray-600 group-hover:text-brand-red'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.type === 'property' ? `/view-details/${result.id}` : `/developers/${result.id}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
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
                        <div className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{result.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{result.type}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className={`md:hidden ${lightNav ? 'text-white' : 'text-gray-700'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden mt-4 space-y-2 pb-4 ${lightNav ? 'text-white' : ''}`}>
            <Link href="/" className={`block py-2 transition ${lightNav ? 'hover:text-white/80' : 'text-gray-700 hover:text-brand-red'}`} onClick={() => setIsMenuOpen(false)}>Home +</Link>
            <Link href="/properties" className={`block py-2 transition ${lightNav ? 'hover:text-white/80' : 'text-gray-700 hover:text-brand-red'}`} onClick={() => setIsMenuOpen(false)}>Property +</Link>
            <Link href="/blogs" className={`block py-2 transition ${lightNav ? 'hover:text-white/80' : 'text-gray-700 hover:text-brand-red'}`} onClick={() => setIsMenuOpen(false)}>Blogs +</Link>
            <Link href="/pages" className={`block py-2 transition ${lightNav ? 'hover:text-white/80' : 'text-gray-700 hover:text-brand-red'}`} onClick={() => setIsMenuOpen(false)}>Services +</Link>
            <Link href="/about" className={`block py-2 transition ${lightNav ? 'hover:text-white/80' : 'text-gray-700 hover:text-brand-red'}`} onClick={() => setIsMenuOpen(false)}>About +</Link>
            <Link href="/contact" className={`block py-2 transition ${lightNav ? 'hover:text-white/80' : 'text-gray-700 hover:text-brand-red'}`} onClick={() => setIsMenuOpen(false)}>Contact +</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
