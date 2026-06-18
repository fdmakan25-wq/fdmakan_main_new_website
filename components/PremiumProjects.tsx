'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Property {
  _id?: string;
  id?: string | number;
  name: string;
  price: number | string;
  location: string;
  images?: string[];
  image?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  subCategory?: string;
  typology?: string;
}

export default function PremiumProjects() {
  const [databaseProperties, setDatabaseProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo data (fallback)
  const demoProjects = [
    {
      id: 1,
      name: "LODHA UPPER THANE",
      price: "₹ 2.5Cr - ₹ 4.8Cr",
      typology: "2 - 4 Bed Apartment",
      location: "Thane, Maharashtra",
      description: "Luxury living spaces with world-class amenities and modern architecture.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      name: "PRESTIGE PARK RIDGE",
      price: "₹ 3.2Cr - ₹ 5.5Cr",
      typology: "3 - 5 Bed Apartment",
      location: "Whitefield, Bangalore",
      description: "Tailored enclosures engineered for durability, player safety, and spectator visibility.",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      name: "DLF CAMELIAS",
      price: "₹ 8.5Cr - ₹ 12Cr",
      typology: "4 - 5 Bed Luxury Apartment",
      location: "Gurgaon, Haryana",
      description: "Premium residential spaces designed for exceptional living experiences.",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 4,
      name: "GODREJ BLISS",
      price: "₹ 1.8Cr - ₹ 3.2Cr",
      typology: "2 - 3 Bed Apartment",
      location: "Mumbai, Maharashtra",
      description: "Modern living spaces with smart home features and sustainable design.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 5,
      name: "KALPATARU RADIANCE",
      price: "₹ 4.6Cr - ₹ 7.2Cr",
      typology: "3 - 4 Bed Apartment",
      location: "Goregaon, Mumbai",
      description: "Secure and elegant residential complexes with comprehensive amenities.",
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        // Filter properties that should be shown in Premium Projects
        const premiumProperties = data.filter((prop: any) => prop.showInPremium === true);
        // Convert database properties to display format
        const formatted: Property[] = premiumProperties.slice(0, 5).map((prop: any) => ({
          _id: prop._id,
          id: prop._id,
          name: prop.name.toUpperCase(),
          price: `₹ ${(prop.price / 10000000).toFixed(1)}Cr${prop.price > 10000000 ? ` - ₹ ${((prop.price * 1.5) / 10000000).toFixed(1)}Cr` : ''}`,
          typology: prop.bedrooms ? `${prop.bedrooms} - ${prop.bedrooms + 1} Bed Apartment` : 'Property',
          location: prop.location,
          description: prop.description || "Premium property with modern amenities and excellent location.",
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }));
        setDatabaseProperties(formatted);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Merge database properties with demo data (database first, then demo)
  const allProjects = [
    ...databaseProperties,
    ...demoProjects.slice(databaseProperties.length)
  ].slice(0, 5);

  // Top row projects (2 large cards)
  const topProjects = allProjects.slice(0, 2);
  // Bottom row projects (3 smaller cards)
  const bottomProjects = allProjects.slice(2, 5);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold flex items-center">
            <span className="text-brand-red">Premium</span>
            <span className="text-gray-900 ml-4">Projects</span>
          </h2>
        </div>

        {/* Projects Grid - Matching Image Layout */}
        <div className="space-y-6">
          {/* Top Row - 2 Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topProjects.map((project: any) => (
              <div
                key={project.id}
                onClick={() => window.location.href = `/view-details/${String(project.id)}`}
                className="group relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer"
              >
                {/* Image with Hover Effect */}
                <div className="absolute inset-0">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700"></div>
                </div>

                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  {/* Top Left - Project Name */}
                  <div>
                    <h3 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                      {project.name}
                    </h3>
                    {/* Red Ray - Appears on Hover */}
                    <div className="h-1 bg-brand-red w-0 group-hover:w-full transition-all duration-500 ease-out mb-3"></div>
                    {project.description && (
                      <p className="text-white/90 text-sm md:text-base max-w-md leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom - Project Details */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="text-white space-y-2">
                      <div className="text-lg font-semibold">{project.price}</div>
                      <div className="text-sm">{project.typology}</div>
                      <div className="text-sm">{project.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - 3 Smaller Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bottomProjects.map((project: any) => (
              <div
                key={project.id}
                onClick={() => window.location.href = `/view-details/${String(project.id)}`}
                className="group relative h-[350px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer"
              >
                {/* Image with Hover Effect */}
                <div className="absolute inset-0">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-700"></div>
                </div>

                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top Left - Project Name */}
                  <div>
                    <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide mb-2">
                      {project.name}
                    </h3>
                    {/* Red Ray - Appears on Hover */}
                    <div className="h-1 bg-brand-red w-0 group-hover:w-full transition-all duration-500 ease-out mb-3"></div>
                    {project.description && (
                      <p className="text-white/90 text-xs md:text-sm max-w-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom - Project Details */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="text-white space-y-1">
                      <div className="text-base font-semibold">{project.price}</div>
                      <div className="text-xs">{project.typology}</div>
                      <div className="text-xs">{project.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

