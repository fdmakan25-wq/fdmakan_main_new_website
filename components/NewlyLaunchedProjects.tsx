'use client';

import PropertyProjectsCarousel from '@/components/PropertyProjectsCarousel';

const demoProjects = [
  {
    id: 1,
    name: 'Mahindra Lifespaces Eden',
    price: '₹ 1.8Cr - ₹ 3.2Cr',
    typology: '2 - 3 Bed Apartment',
    location: 'Pune, Maharashtra',
    image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Sobha Neopolis',
    price: '₹ 2.1Cr - ₹ 3.8Cr',
    typology: '2 - 4 Bed Apartment',
    location: 'Bangalore, Karnataka',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Tata Housing Elysia',
    price: '₹ 1.5Cr - ₹ 2.9Cr',
    typology: '1.5 - 3 Bed Apartment',
    location: 'Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Prestige Lakeside Habitat',
    price: '₹ 2.4Cr - ₹ 4.1Cr',
    typology: '2 - 4 Bed Apartment',
    location: 'Bangalore, Karnataka',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  },
];

export default function NewlyLaunchedProjects() {
  return (
    <PropertyProjectsCarousel
      titleHighlight="Newly Launched"
      titleRest="Projects"
      filterKey="showInNewlyLaunched"
      demoProjects={demoProjects}
      sortByDate
    />
  );
}
