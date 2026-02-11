'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

// NavLink Component with hover effects
function NavLink({ href, pathname, children }: { href: string; pathname: string; children: React.ReactNode }) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative flex items-center transition-all duration-300
        ${isActive
          ? 'font-bold'
          : 'font-medium text-gray-700'
        }
        group
      `}
    >
      <span className={`
        relative inline-block transition-all duration-300
        ${isActive
          ? 'bg-gradient-to-r from-brand-red via-brand-teal to-brand-red bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient'
          : 'group-hover:bg-gradient-to-r group-hover:from-brand-red group-hover:via-brand-teal group-hover:to-brand-red group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-[length:200%_100%] group-hover:animate-gradient'
        }
      `}>
        {children}
      </span>
      <span className={`
        ml-1 text-xs text-brand-teal inline-block origin-center transition-all duration-300
        ${isActive
          ? 'scale-125'
          : 'group-hover:animate-spin-slow'
        }
      `}>
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
  const pathname = usePathname();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Fetch both properties and developers
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

        setSearchResults([...filteredProps, ...filteredDevs].slice(0, 8));
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <header className="glass-morphism sticky top-0 z-50 shadow-soft">
      <nav className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* To adjust logo size: Change height and width values below (in pixels) */}
          <Link href="/" className="flex items-center hover:opacity-80 transition">
            <Image
              src="/fd_makan_logo-removebg-preview.png"
              alt="FD MAKAN Logo"
              width={180}
              height={180}
              style={{ height: '180px', width: '180px' }}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href="/about" pathname={pathname}>
              About
            </NavLink>
            <NavLink href="/properties" pathname={pathname}>
              Property
            </NavLink>
            <NavLink href="/news" pathname={pathname}>
              News
            </NavLink>
            <NavLink href="/pages" pathname={pathname}>
              Pages
            </NavLink>
            <Link href="/contact" className={`text-gray-700 hover:text-brand-red transition font-medium ${pathname === '/contact' ? 'font-bold' : ''}`}>
              Contact
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {/* Expandable Search Input */}
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
              className="w-11 h-11 bg-white border border-gray-100 rounded-lg flex items-center justify-center hover:border-brand-red hover:bg-brand-red/5 transition group shadow-soft hover:shadow-glow z-10"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
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
            {/* 
            <button className="w-11 h-11 bg-white border border-gray-100 rounded-lg flex items-center justify-center hover:border-brand-red hover:bg-brand-red/5 transition group shadow-soft hover:shadow-glow">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            */}
            {/* 
            <button className="w-11 h-11 bg-white border border-gray-100 rounded-lg flex items-center justify-center hover:border-brand-red hover:bg-brand-red/5 transition relative group shadow-soft hover:shadow-glow">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">2</span>
            </button>
            */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-brand-red transition">
              Home +
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-orange-500">
              About +
            </Link>
            <Link href="/properties" className="block py-2 text-gray-700 hover:text-orange-500">
              Property +
            </Link>
            <Link href="/news" className="block py-2 text-gray-700 hover:text-orange-500">
              News +
            </Link>
            <Link href="/pages" className="block py-2 text-gray-700 hover:text-orange-500">
              Pages +
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-orange-500">
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

