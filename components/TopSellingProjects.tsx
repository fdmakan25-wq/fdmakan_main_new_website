'use client';

import PropertyProjectsCarousel from '@/components/PropertyProjectsCarousel';

const demoProjects = [
  {
    id: 1,
    name: 'Godrej Bliss Kandivali',
    price: '₹ 1.62Cr - ₹ 2.33Cr',
    typology: '2 - 3 Bed Apartment',
    location: 'Kandivali, Kandivali West, Mumbai',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Shapoorji Pallonji Sarova',
    price: '₹ 1.66Cr - ₹ 3.22Cr',
    typology: '1.5 - 3 Bed Apartment',
    location: 'Kandivali East Mumbai Maharashtra',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Kalpataru Radiance Goregaon',
    price: '₹ 4.6Cr',
    typology: '2 - 4 Bed Apartment',
    location: 'Goregaon West, Mumbai, Maharashtra',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Lodha Amara',
    price: '₹ 1.2Cr - ₹ 2.8Cr',
    typology: '1 - 3 Bed Apartment',
    location: 'Thane, Maharashtra',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  },
];

export default function TopSellingProjects() {
  return (
    <PropertyProjectsCarousel
      titleHighlight="Top Selling"
      titleRest="Projects"
      filterKey="showInTopSelling"
      demoProjects={demoProjects}
    />
  );
}
