'use client';

import {
  buildPropertyDisplaySections,
  type PropertyDisplaySection,
} from '@/lib/property-details-display';
import type { ListingFor } from '@/lib/property-listing-options';
import { SectionIcon, InlineIconBox, IconDocument, IconCheck } from '@/components/property/PropertySectionIcons';

interface PropertyListingDetailsProps {
  listingFor?: ListingFor | string;
  propertyType?: string;
  propertyCategory?: string;
  categoryFields?: Record<string, unknown>;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  possessionStatus?: string;
  possessionDate?: string;
}

function DetailSection({ section }: { section: PropertyDisplaySection }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {section.fields.map((field) => (
        <div
          key={`${section.title}-${field.label}`}
          className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-transparent hover:border-brand-teal/30 hover:bg-white transition-all"
        >
          <div className="mt-0.5 flex-shrink-0">
            <InlineIconBox color="teal">
              <IconCheck />
            </InlineIconBox>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{field.label}</p>
            <p className="text-gray-900 font-semibold leading-relaxed break-words">{field.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PropertyListingDetails(props: PropertyListingDetailsProps) {
  const sections = buildPropertyDisplaySections(props);
  if (sections.length === 0) return null;

  return (
    <section
      id="details"
      className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] scroll-mt-48"
    >
      <div className="flex items-center gap-3 mb-8">
        <SectionIcon color="teal">
          <IconDocument />
        </SectionIcon>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Property Details</h2>
      </div>
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h3>
            <DetailSection section={section} />
          </div>
        ))}
      </div>
    </section>
  );
}
