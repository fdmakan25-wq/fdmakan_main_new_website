'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';

interface TopPickProject {
  id: string;
  developerName: string;
  projectName: string;
  location: string;
  price: string;
  apartmentTypes: string;
  specialOffer?: string;
  image: string;
}

const demoProjects: TopPickProject[] = [
  {
    id: 'demo-1',
    developerName: 'Ishtika Homes',
    projectName: 'Ishtika Anahata',
    location: 'Samethanahalli, Bangalore East',
    price: '₹86.65 L – 1.18 Cr',
    apartmentTypes: '2, 2.5, 3 BHK',
    specialOffer: 'No EMI Till Possession',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=500&fit=crop',
  },
  {
    id: 'demo-2',
    developerName: 'RRL Builders',
    projectName: 'RRL Palm Altezze',
    location: 'Bangalore East',
    price: '₹1.01 Cr – 1.3 Cr',
    apartmentTypes: '2, 3 BHK',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop',
  },
  {
    id: 'demo-3',
    developerName: 'Prestige Group',
    projectName: 'Prestige Park Ridge',
    location: 'Whitefield, Bangalore',
    price: '₹2.5 Cr – 4.5 Cr',
    apartmentTypes: '3, 4 BHK',
    specialOffer: 'Early Bird Offer',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop',
  },
  {
    id: 'demo-4',
    developerName: 'Lodha Group',
    projectName: 'Lodha Upper Thane',
    location: 'Thane, Maharashtra',
    price: '₹2.5 Cr – 4.8 Cr',
    apartmentTypes: '2, 3, 4 BHK',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
  },
];

function formatPrice(price: number, pricing?: Array<{ price: string }>) {
  if (pricing && pricing.length > 0) {
    const prices = pricing.map((p) => p.price).filter(Boolean);
    if (prices.length === 1) return prices[0].startsWith('₹') ? prices[0] : `₹ ${prices[0]}`;
    if (prices.length > 1) {
      const first = prices[0].startsWith('₹') ? prices[0] : `₹ ${prices[0]}`;
      const last = prices[prices.length - 1].startsWith('₹') ? prices[prices.length - 1] : `₹ ${prices[prices.length - 1]}`;
      return `${first} – ${last}`;
    }
  }
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} L`;
  return `₹ ${price.toLocaleString('en-IN')}`;
}

function TopPickCard({ project }: { project: TopPickProject }) {
  const isDemo = project.id.startsWith('demo-');

  return (
    <article className="w-[320px] md:w-[360px] flex-shrink-0 mx-3 bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden group hover:shadow-soft-lg hover:border-brand-teal/20 transition-all duration-300">
      <div className="relative h-44 overflow-hidden">
        <SafeImage
          src={project.image}
          alt={project.projectName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {project.specialOffer && (
          <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-md">
            {project.specialOffer}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white/80 text-[10px] font-semibold uppercase tracking-wider">{project.developerName}</p>
          <h3 className="text-white font-bold text-lg leading-tight truncate">{project.projectName}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2 text-gray-500 text-sm">
          <svg className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="leading-snug">{project.location}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-brand-red font-extrabold text-base">{project.price}</p>
          <span className="text-[11px] font-semibold text-navy-blue bg-navy-blue/5 px-2.5 py-1 rounded-full whitespace-nowrap">
            {project.apartmentTypes}
          </span>
        </div>

        {isDemo ? (
          <button className="w-full py-2.5 bg-navy-blue text-white text-sm font-bold rounded-xl hover:bg-brand-teal transition-colors">
            Contact
          </button>
        ) : (
          <Link
            href={`/view-details/${project.id}`}
            className="block w-full py-2.5 bg-navy-blue text-white text-sm font-bold rounded-xl hover:bg-brand-teal transition-colors text-center"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  );
}

export default function HousingTopPicks() {
  const [projects, setProjects] = useState<TopPickProject[]>(demoProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) return;
        const data = await response.json();

        const flagged = data.filter((p: any) => p.showInTopSelling || p.showInPremium);
        const source = flagged.length > 0 ? flagged : data;

        if (source.length === 0) return;

        const formatted: TopPickProject[] = source.map((prop: any) => ({
          id: prop._id,
          developerName: prop.developer || 'Developer',
          projectName: prop.name,
          location: prop.location,
          price: formatPrice(prop.price, prop.pricing),
          apartmentTypes: prop.pricing?.length
            ? prop.pricing.map((p: { type: string }) => p.type).join(', ')
            : 'Premium Homes',
          specialOffer: prop.showInPremium ? 'Premium Pick' : undefined,
          image: prop.images?.[0] || demoProjects[0].image,
        }));

        setProjects(formatted.length >= 3 ? formatted : [...formatted, ...demoProjects].slice(0, 6));
      } catch (error) {
        console.error('Error fetching top picks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const loopedProjects = [...projects, ...projects];

  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-widest rounded-full mb-3">
              Curated For You
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              FD MAKAN&apos;s Top Picks
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Handpicked premium projects — explore top living options with us.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-navy-blue font-bold hover:text-brand-teal transition text-sm"
          >
            View all properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-400">Loading top picks...</div>
      ) : (
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="top-picks-track animate-scroll-left-slow gap-0">
              {loopedProjects.map((project, index) => (
                <TopPickCard key={`${project.id}-${index}`} project={project} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
