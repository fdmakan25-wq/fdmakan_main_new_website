'use client';

import PropertyProjectsCarousel from '@/components/PropertyProjectsCarousel';

export default function TopSellingProjects() {
  return (
    <PropertyProjectsCarousel
      titleHighlight="Top Selling"
      titleRest="Projects"
      filterKey="showInTopSelling"
    />
  );
}
