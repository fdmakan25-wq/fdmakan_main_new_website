'use client';

import PropertyProjectsCarousel from '@/components/PropertyProjectsCarousel';

export default function NewlyLaunchedProjects() {
  return (
    <PropertyProjectsCarousel
      titleHighlight="Newly Launched"
      titleRest="Projects"
      filterKey="showInNewlyLaunched"
      sortByDate
    />
  );
}
