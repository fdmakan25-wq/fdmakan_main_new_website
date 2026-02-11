'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { EXTERNAL_AMENITIES } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyStatsSidebar from '@/components/PropertyStatsSidebar';
import PropertyContactSidebar from '@/components/PropertyContactSidebar';
import EmiCalculator from '@/components/EmiCalculator';

interface Property {
  _id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  available: boolean;
  images: string[];
  videos?: string[];
  createdAt?: string;
  // Additional fields for detailed view
  storeys?: string;
  projectArea?: string;
  possessionStatus?: string;
  advertiserReraNumber?: string;
  possessionDate?: string;
  projectReraNumber?: string;
  address?: string;
  highlights?: string[];
  amenities?: string[];
  facilities?: string[];
  specifications?: {
    floor?: { [key: string]: string };
    fitting?: { [key: string]: string };
    wallCeiling?: { [key: string]: string };
  };
  connectivity?: {
    commute?: Array<{ name: string; distance: string; time: string }>;
    entertainment?: Array<{ name: string; distance: string; time: string }>;
    essentials?: Array<{ name: string; distance: string; time: string }>;
  };
  pricing?: Array<{
    type: string;
    carpetArea: string;
    price: string;
  }>;
  reraQrCode?: string;
}

interface Developer {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  establishedYear?: number;
  totalProjects?: number;
  rating?: number;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [pricingFilter, setPricingFilter] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('highlights');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['highlights', 'overview', 'about', 'pricing', 'emi', 'amenities', 'connectivity', 'builder', 'faq'];
      const scrollPosition = window.scrollY + 200; // Offset for header + sticky nav

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 140; // Approx height of Header + Sticky Tab
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${params.id}`);
      if (!response.ok) throw new Error('Property not found');
      const data = await response.json();
      setProperty(data);

      // Fetch developer info
      if (data.developer) {
        const devResponse = await fetch('/api/developers');
        if (devResponse.ok) {
          const developers = await devResponse.json();
          const foundDev = developers.find((d: Developer) => d.name === data.developer);
          if (foundDev) setDeveloper(foundDev);
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading property details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
            <button
              onClick={() => router.push('/')}
              className="text-brand-red hover:text-brand-red-dark"
            >
              Go back to homepage
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Default highlights if not provided
  const defaultHighlights = property.highlights || [
    `Well-appointed ${property.bedrooms || 3} BHK apartments featuring private decks`,
    `Located in ${property.location}`,
    `Premium location with excellent connectivity`,
    `Expansive project offering breathtaking views`,
    `Modern architecture and design`,
    `World-class amenities and facilities`,
    `24/7 multi-level security for safety and peace of mind`,
    `Close to prominent areas and landmarks`,
    `Ready to move in`,
    `RERA approved project`
  ];

  const displayedHighlights = showAllHighlights ? defaultHighlights : defaultHighlights.slice(0, 5);

  // Default amenities and facilities
  const defaultAmenities = property.amenities || ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Parking', 'Security'];
  const defaultFacilities = property.facilities || ['Lift', 'Gas Pipeline', 'Power Back Up', 'Parking', 'Security System'];

  // Default pricing data
  const defaultPricing = property.pricing || [
    { type: '2 BHK', carpetArea: `${property.area ? Math.floor(property.area * 0.6) : 687} Sq.ft`, price: `₹ ${((property.price * 0.8) / 10000000).toFixed(2)} Cr` },
    { type: '3 BHK', carpetArea: `${property.area || 1041} Sq.ft`, price: `₹ ${(property.price / 10000000).toFixed(2)} Cr` },
  ];

  const filteredPricing = pricingFilter === 'all'
    ? defaultPricing
    : defaultPricing.filter(p => p.type.includes(pricingFilter));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 3-Column Layout Container */}
      <div className="container mx-auto px-4 max-w-[1600px] py-8">
        <div className="flex flex-col xl:flex-row gap-6 relative">

          {/* LEFT SIDEBAR - Sticky */}
          <div className="hidden xl:block w-[150px] 2xl:w-[170px] flex-shrink-0">
            <div className="sticky top-24 h-fit">
              <PropertyStatsSidebar />
            </div>
          </div>

          {/* CENTER CONTENT - Scrollable */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Gallery / Hero Section (Moved inside center column or kept full width? Based on image, headers are usually full width, but content is center. Let's put the main content here.) */}

            {/* Hero Image Section */}
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <>
                    <Image
                      src={property.images[selectedImage]}
                      alt={property.name}
                      fill
                      className="object-cover"
                      priority
                    />

                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((selectedImage + 1) % property.images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition"
                        >
                          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedImage((selectedImage - 1 + property.images.length) % property.images.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition"
                        >
                          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Highlights Section */}

            {/* Horizontal Sticky Navigation Tabs */}
            <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md shadow-lg shadow-gray-100 border border-gray-100 -mx-4 px-4 md:mx-0 md:px-2 md:rounded-2xl overflow-x-auto scrollbar-hide py-3">
              <div className="flex whitespace-nowrap min-w-full gap-2 px-1">
                {['Highlights', 'Overview', 'About', 'Pricing', 'EMI', 'Amenities', 'Connectivity', 'Builder', 'FAQ'].map((item) => {
                  const id = item.toLowerCase();
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`
                        px-5 py-2.5 text-sm font-bold transition-all duration-300 relative rounded-xl
                        ${isActive
                          ? 'bg-navy-blue text-white shadow-md shadow-brand-teal/20 scale-105'
                          : 'text-gray-500 hover:text-navy-blue hover:bg-gray-50'
                        }
                      `}
                    >
                      {item}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <section id="highlights" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Highlights of {property.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-transparent hover:border-brand-teal/30 hover:bg-white transition-all group">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
              {defaultHighlights.length > 5 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowAllHighlights(!showAllHighlights)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:text-brand-teal transition-all"
                  >
                    <span>{showAllHighlights ? 'View Fewer Highlights' : 'View All Highlights'}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${showAllHighlights ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </section>

            {/* Overview Section */}
            <section id="overview" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Overview of {property.name}</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Storeys', value: property.storeys || `G + ${property.bedrooms ? property.bedrooms + 30 : 39}`, icon: '🏢' },
                  { label: 'Project Area', value: property.projectArea || '5.5 Acres', icon: '📏' },
                  { label: 'Possession Status', value: property.possessionStatus || (property.available ? 'Ready to Move' : 'Under Construction'), icon: '🔑' },
                  { label: 'Advertiser RERA', value: property.advertiserReraNumber || 'A52000000045', icon: '📝' },
                  { label: 'Possession Date', value: property.possessionDate || '12-2028', icon: '📅' },
                  { label: 'Project RERA', value: property.projectReraNumber || 'P51900046369', isLink: true, icon: '📜' },
                ].map((item, idx) => (
                  <div key={idx} className="group p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-brand-red/30 hover:bg-white transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</span>
                        <span className={`font-bold text-lg ${item.isLink ? 'text-brand-teal hover:underline cursor-pointer' : 'text-gray-900'}`}>{item.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About Project */}
            <section id="about" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-navy-blue/10 rounded-xl flex items-center justify-center text-navy-blue">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">About {property.name}</h2>
              </div>
              <div className="relative">
                <div className={`prose max-w-none text-gray-600 leading-relaxed text-lg transition-all duration-500 ${!showFullAbout ? 'max-h-[150px] overflow-hidden' : 'max-h-[2000px]'}`}>
                  <p className="mb-4 whitespace-pre-line">{property.description}</p>
                </div>

                <div className="mt-6 flex justify-start">
                  <button
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="flex items-center gap-2 group text-navy-blue font-bold hover:text-brand-teal transition-all"
                  >
                    <span>{showFullAbout ? 'Show Less' : 'Read Full Description'}</span>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${showFullAbout ? 'rotate-180' : 'group-hover:translate-y-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {property.reraQrCode && (
                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                      <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-sm border border-gray-200 flex-shrink-0 animate-in zoom-in duration-500">
                        <img
                          src={property.reraQrCode}
                          alt="RERA QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-navy-blue mb-2">Authenticated RERA Project</h4>
                        <p className="text-gray-600 mb-4 font-medium italic">Scan this QR code or use the RERA tracking number {property.projectReraNumber || 'P51900046369'} to verify all project details on the official Mahadera website.</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-xs font-black uppercase tracking-widest border border-brand-teal/20">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified & Secured
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pricing</h2>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {['all', '2 BHK', '3 BHK'].map(type => (
                  <button
                    key={type}
                    onClick={() => setPricingFilter(type)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${pricingFilter === type
                      ? 'bg-navy-blue text-white shadow-lg shadow-brand-teal/20 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type === 'all' ? 'All Configurations' : type}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Carpet Area</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPricing.map((item, index) => (
                      <tr key={index} className="hover:bg-brand-teal/5 transition-colors group">
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-900 group-hover:text-navy-blue transition-colors">{item.type}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-gray-600 font-medium">{item.carpetArea}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-lg font-black text-navy-blue">{item.price}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-bold text-brand-teal hover:bg-brand-teal hover:text-white hover:border-transparent transition-all shadow-sm">
                            <span>Price Breakup</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* EMI Calculator Section */}
            <section id="emi" className="scroll-mt-36">
              <EmiCalculator defaultLoanAmount={property.price} />
            </section>

            {/* Amenities Section */}
            <section id="amenities" className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm scroll-mt-36">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-navy-blue">Amenities</h2>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 italic">External Amenities</h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
                  {EXTERNAL_AMENITIES.filter(amenity => property.amenities?.includes(amenity.name)).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-navy-blue group-hover:bg-navy-blue group-hover:text-white transition-colors border border-gray-100 text-xl shadow-sm">
                        <span>{amenity.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-navy-blue transition-colors">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                  {(!property.amenities || property.amenities.length === 0) && (
                    <div className="col-span-full text-gray-500 italic">No external amenities listed.</div>
                  )}
                </div>
              </div>
            </section>

            {/* Connectivity */}
            <section id="connectivity" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Location & Connectivity</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Site Address</h3>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold leading-relaxed">
                      {property.address || `${property.name}, ${property.location}, India`}
                    </p>
                  </div>

                  <button className="mt-6 w-full py-4 rounded-xl bg-navy-blue text-white font-bold hover:bg-brand-teal transition-all shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 7m0 10V7" />
                    </svg>
                    <span>View on Google Maps</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Nearby Landmarks</h3>
                  <div className="space-y-3">
                    {(property.connectivity?.commute || [
                      { name: 'Metro Station', distance: '1.2 km' },
                      { name: 'Shopping Mall', distance: '2.5 km' },
                      { name: 'Hospital', distance: '0.8 km' },
                      { name: 'School', distance: '1.5 km' }
                    ]).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-transparent hover:border-brand-teal/30 hover:bg-white transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-150 transition-transform"></div>
                          <span className="text-gray-700 font-bold">{item.name}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white text-brand-teal text-xs font-black shadow-sm border border-gray-100">
                          {item.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* About Developer */}
            <section id="builder" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">About Developer</h2>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="w-full lg:w-1/3 flex flex-col items-center">
                    <div className="group relative w-full aspect-square max-w-[200px] mb-6">
                      {developer?.logo ? (
                        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 border border-gray-50">
                          <img src={developer.logo} alt={developer.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-navy-blue rounded-3xl shadow-xl flex items-center justify-center text-white text-6xl font-black group-hover:rotate-6 transition-transform duration-500">
                          {developer?.name?.[0] || 'D'}
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 text-center mb-2">{developer?.name || property.developer}</h3>
                    {developer?.establishedYear && (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-widest">
                        <span>Established In {developer.establishedYear}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-6">
                    <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                      "{developer?.description || `${developer?.name || property.developer} is a reputed developer known for quality construction and timely delivery. They have transformed the skyline with their iconic projects.`}"
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Experience</div>
                        <div className="text-2xl font-black text-navy-blue">15+ Years</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">Projects</div>
                        <div className="text-2xl font-black text-navy-blue">45+ Delivered</div>
                      </div>
                    </div>

                    <button className="flex items-center gap-2 group text-navy-blue font-bold hover:gap-4 transition-all">
                      <span>More about this developer</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-36">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {[
                  { q: `What is the pricing of ${property.name}?`, a: `The pricing starts from ₹ ${((property.price * 0.8) / 10000000).toFixed(2)} Cr for 2 BHK configurations.` },
                  { q: `Where is ${property.name} located?`, a: `${property.name} is prime located in ${property.location}, offering excellent connectivity to key parts of the city.` },
                  { q: `What is the possession status?`, a: `Currently, the project is ${property.available ? 'Ready to Move' : 'Under Construction'} with possession expected around ${property.possessionDate || 'December 2028'}.` },
                  { q: `Is ${property.name} RERA registered?`, a: `Yes, ${property.name} is a RERA approved project. The project RERA number is ${property.projectReraNumber || 'P51900046369'}.` }
                ].map((faq, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden group">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-all ${expandedFaq === idx ? 'bg-brand-teal/5' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <span className={`font-bold text-lg ${expandedFaq === idx ? 'text-navy-blue' : 'text-gray-700'}`}>{faq.q}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedFaq === idx ? 'bg-navy-blue text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedFaq === idx ? 'max-h-[200px] border-t border-gray-100' : 'max-h-0'}`}>
                      <div className="p-5 text-gray-600 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR - Sticky */}
          <div className="hidden lg:block w-[320px] 2xl:w-[350px] flex-shrink-0">
            <div className="sticky top-24 h-fit">
              <PropertyContactSidebar propertyName={property.name} />
            </div>
          </div>

        </div >
      </div >

      {/* Mobile Sticky Bottom Action Bar (Only visible on small screens where sidebars are hidden) */}
      < div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 flex gap-4" >
        <button className="flex-1 bg-white border border-navy-blue text-navy-blue py-3 rounded-lg font-bold">
          Call Now
        </button>
        <button className="flex-1 bg-navy-blue text-white py-3 rounded-lg font-bold">
          Book Visit
        </button>
      </div >

      <Footer />
    </div >
  );
}
