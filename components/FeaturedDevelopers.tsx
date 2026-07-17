'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';

interface Developer {
  _id: string;
  id: string;
  name: string;
  logoUrl?: string;
}

export default function FeaturedDevelopers() {
  const router = useRouter();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('/api/developers');
        if (!response.ok) return;
        const data = await response.json();
        const formatted: Developer[] = data.map((dev: { _id: string; name: string; logo?: string }) => ({
          id: dev._id,
          _id: dev._id,
          name: dev.name,
          logoUrl: dev.logo || undefined,
        }));
        setDevelopers(formatted);
      } catch (error) {
        console.error('Error fetching developers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  if (!loading && developers.length === 0) {
    return null;
  }

  const marqueeDevelopers = [...developers, ...developers];

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold flex items-center">
            <span className="text-gray-400 relative inline-block">
              Featured
              <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500" />
            </span>
            <span className="text-gray-900 ml-4">Developers</span>
          </h2>
        </div>

        <div className="relative overflow-hidden">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading developers...</div>
          ) : (
            <div className="flex animate-scroll-left">
              {marqueeDevelopers.map((developer, index) => (
                <div
                  key={`${developer.id}-${index}`}
                  className="flex-shrink-0 px-3"
                  style={{ width: '280px' }}
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/developers/${developer._id}`)}
                    className="w-full h-36 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer block bg-gray-100"
                    aria-label={developer.name}
                  >
                    {developer.logoUrl ? (
                      <SafeImage
                        src={developer.logoUrl}
                        alt={developer.name}
                        width={280}
                        height={144}
                        className="w-full h-full object-contain bg-white"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy-blue to-brand-teal flex items-center justify-center px-4">
                        <span className="text-white font-bold text-center text-sm md:text-base leading-tight">
                          {developer.name}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
