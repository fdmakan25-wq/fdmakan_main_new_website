export type ListingFor = 'sale' | 'rent' | 'pg';
export type PropertyCategory = 'residential' | 'commercial';

export const LISTING_FOR_OPTIONS: { value: ListingFor; label: string }[] = [
  { value: 'sale', label: 'Sale' },
  { value: 'rent', label: 'Rent/ Lease' },
];

export const PROPERTY_CATEGORY_OPTIONS: { value: PropertyCategory; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
];

export interface PropertyTypeOption {
  value: string;
  label: string;
}

export interface PropertyTypeGroup {
  label: string;
  category: PropertyCategory;
  options: PropertyTypeOption[];
}

export const PROPERTY_TYPE_GROUPS: PropertyTypeGroup[] = [
  {
    label: 'Residential',
    category: 'residential',
    options: [
      { value: 'flat-apartment', label: 'Flat/ Apartment' },
      { value: 'residential-house', label: 'Residential House' },
      { value: 'villa', label: 'Villa' },
      { value: 'residential-land-plot', label: 'Residential Land/ Plot' },
      { value: 'penthouse', label: 'Penthouse' },
      { value: 'studio-apartment', label: 'Studio Apartment' },
    ],
  },
  {
    label: 'Commercial',
    category: 'commercial',
    options: [
      { value: 'commercial-office-space', label: 'Commercial Office Space' },
      { value: 'office-it-park-sez', label: 'Office in IT Park/ SEZ' },
      { value: 'commercial-shop', label: 'Commercial Shop' },
      { value: 'commercial-showroom', label: 'Commercial Showroom' },
      { value: 'commercial-land', label: 'Commercial Land' },
      { value: 'warehouse-godown', label: 'Warehouse/ Godown' },
      { value: 'industrial-land', label: 'Industrial Land' },
      { value: 'industrial-building', label: 'Industrial Building' },
      { value: 'industrial-shed', label: 'Industrial Shed' },
    ],
  },
];

export function getPropertyCategoryForType(propertyType: string): PropertyCategory | '' {
  if (!propertyType) return '';
  for (const group of PROPERTY_TYPE_GROUPS) {
    if (group.options.some((option) => option.value === propertyType)) {
      return group.category;
    }
  }
  return '';
}

export function getPropertyTypeLabel(propertyType: string): string {
  if (!propertyType) return '';
  for (const group of PROPERTY_TYPE_GROUPS) {
    const match = group.options.find((option) => option.value === propertyType);
    if (match) return match.label;
  }
  return propertyType;
}

const RENT_EXCLUDED_PROPERTY_TYPES = new Set(['residential-land-plot']);

export function getFilteredPropertyTypeGroups(listingFor: ListingFor): PropertyTypeGroup[] {
  if (listingFor !== 'rent') return PROPERTY_TYPE_GROUPS;
  return PROPERTY_TYPE_GROUPS.map((group) => ({
    ...group,
    options: group.options.filter((option) => !RENT_EXCLUDED_PROPERTY_TYPES.has(option.value)),
  }));
}

export function getPropertyTypesForCategory(
  category: PropertyCategory | '',
  listingFor: ListingFor
): PropertyTypeOption[] {
  if (!category) return [];
  const group = getFilteredPropertyTypeGroups(listingFor).find((g) => g.category === category);
  return group?.options ?? [];
}

export function getPropertyCategoryLabel(category: PropertyCategory | ''): string {
  if (!category) return '';
  return PROPERTY_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}
