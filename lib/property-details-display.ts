import { getPropertyTypeLabel, type ListingFor } from '@/lib/property-listing-options';

export interface PropertyDisplayField {
  label: string;
  value: string;
}

export interface PropertyDisplaySection {
  title: string;
  fields: PropertyDisplayField[];
}

const SKIP_KEYS = new Set([
  'photoCategories',
  'showBuiltUpArea',
  'projectSocietyName',
  'bedroomSizes',
  'noBrokerResponse',
  'priceIncludesPlc',
  'priceIncludesCarParking',
  'priceIncludesClubMembership',
  'stampDutyExcluded',
  'electricityWaterExcluded',
]);

const FIELD_LABELS: Record<string, string> = {
  landZone: 'Land Zone',
  idealForBusinesses: 'Ideal For Businesses',
  societyFlatsCount: 'Flats in Society',
  bedrooms: 'Bedrooms',
  balconies: 'Balconies',
  floorNo: 'Floor No.',
  totalFloors: 'Total Floors',
  furnishedStatus: 'Furnished Status',
  washrooms: 'Washrooms',
  bathrooms: 'Bathrooms',
  numberOfSeats: 'Number of Seats',
  cabinMeetingRooms: 'Cabin/Meeting Rooms',
  personalWashroom: 'Personal Washroom',
  pantryCafeteria: 'Pantry/Cafeteria',
  cornerShop: 'Corner Shop',
  isMainRoadFacing: 'Main Road Facing',
  openSides: 'Open Sides',
  roadWidth: 'Road Width',
  roadWidthUnit: 'Road Width Unit',
  constructionDone: 'Construction Done',
  boundaryWall: 'Boundary Wall',
  gatedColony: 'Gated Colony',
  isCornerPlot: 'Corner Plot',
  superArea: 'Super Area',
  superAreaUnit: 'Super Area Unit',
  builtUpArea: 'Built Up Area',
  builtUpAreaUnit: 'Built Up Area Unit',
  carpetArea: 'Carpet Area',
  carpetAreaUnit: 'Carpet Area Unit',
  coveredArea: 'Covered Area',
  coveredAreaUnit: 'Covered Area Unit',
  plotArea: 'Plot Area',
  plotAreaUnit: 'Plot Area Unit',
  plotLength: 'Plot Length',
  plotBreadth: 'Plot Breadth',
  plotDimensionUnit: 'Plot Dimension Unit',
  floorsAllowedConstruction: 'Floors Allowed',
  transactionType: 'Transaction Type',
  possessionStatus: 'Possession Status',
  ageOfConstruction: 'Age of Construction',
  availableFromMonth: 'Available From (Month)',
  availableFromYear: 'Available From (Year)',
  expectedPrice: 'Expected Price',
  pricePerSqft: 'Price per Sq-ft',
  basicPricePerSqft: 'Basic Price per Sq-ft',
  floorPlcPerSqft: 'Floor PLC per Sq-ft',
  bookingTokenAmount: 'Booking/Token Amount',
  maintenanceCharges: 'Maintenance Charges',
  maintenanceFrequency: 'Maintenance Frequency',
  brokerage: 'Brokerage',
  currentlyLeasedOut: 'Currently Leased Out',
  monthlyRent: 'Monthly Rent',
  leasedOn: 'Leased On',
  currentBusinessSector: 'Current Business Sector',
  inBusinessSince: 'In Business Since',
  assuredReturns: 'Assured Returns',
  rateOfReturn: 'Rate of Return',
  availableFromType: 'Available From',
  availableFromDate: 'Available From Date',
  currentlyRentOut: 'Currently Rented Out',
  securityAmount: 'Security Amount',
};

function formatListingFor(value?: ListingFor | string): string {
  if (value === 'rent') return 'Rent / Lease';
  if (value === 'pg') return 'PG / Hostel';
  if (value === 'sale') return 'For Sale';
  return '';
}

function formatFieldValue(key: string, value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.join(', ') : null;
  if (typeof value === 'object') return null;

  const str = String(value);
  if (key === 'transactionType') {
    return str === 'new' ? 'New Property' : str === 'resale' ? 'Resale' : str;
  }
  if (key === 'possessionStatus') {
    return str === 'ready-to-move' ? 'Ready to Move' : str === 'under-construction' ? 'Under Construction' : str;
  }
  if (key === 'furnishedStatus') {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (key === 'pantryCafeteria') {
    return str === 'not-available' ? 'Not Available' : str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (key === 'availableFromType') {
    return str === 'immediately' ? 'Immediately' : str === 'select-date' ? 'Select Date' : str;
  }
  if (['yes', 'no'].includes(str) && (key.includes('Washroom') || key.includes('Leased') || key.includes('Rent') || key.includes('Returns') || key.includes('corner') || key.includes('Road') || key.includes('construction') || key.includes('boundary') || key.includes('gated') || key.includes('Corner'))) {
    return str === 'yes' ? 'Yes' : 'No';
  }
  if (key.endsWith('Unit') || key === 'plotDimensionUnit') return str;

  if (['roadWidth', 'superArea', 'builtUpArea', 'carpetArea', 'coveredArea', 'plotArea', 'plotLength', 'plotBreadth'].includes(key)) {
    const unitKey = key === 'roadWidth' ? 'roadWidthUnit' : key.replace('Area', 'AreaUnit').replace('Length', 'DimensionUnit').replace('Breadth', 'DimensionUnit');
    return str;
  }

  if (['expectedPrice', 'monthlyRent', 'securityAmount', 'maintenanceCharges', 'bookingTokenAmount'].includes(key)) {
    const amount = parseIndianPriceValue(str);
    if (amount > 0) return formatIndianPriceShort(amount);
    return str.startsWith('₹') ? str : `₹ ${str}`;
  }

  if (['basicPricePerSqft', 'floorPlcPerSqft', 'pricePerSqft'].includes(key)) {
    return str.startsWith('₹') ? str : `₹ ${str}`;
  }

  return str;
}

function appendUnit(fields: Record<string, unknown>, key: string, value: string): string {
  if (key === 'roadWidth') return `${value} ${fields.roadWidthUnit || 'Meters'}`;
  if (key === 'superArea') return `${value} ${fields.superAreaUnit || 'Sq-ft'}`;
  if (key === 'builtUpArea') return `${value} ${fields.builtUpAreaUnit || 'Sq-ft'}`;
  if (key === 'carpetArea') return `${value} ${fields.carpetAreaUnit || 'Sq-ft'}`;
  if (key === 'coveredArea') return `${value} ${fields.coveredAreaUnit || 'Sq-ft'}`;
  if (key === 'plotArea') return `${value} ${fields.plotAreaUnit || 'Sq-yrd'}`;
  if (key === 'plotLength' || key === 'plotBreadth') return `${value} ${fields.plotDimensionUnit || 'yrd'}`;
  return value;
}

function fieldsFromKeys(
  raw: Record<string, unknown>,
  keys: string[]
): PropertyDisplayField[] {
  const result: PropertyDisplayField[] = [];
  for (const key of keys) {
    if (SKIP_KEYS.has(key)) continue;
    const formatted = formatFieldValue(key, raw[key]);
    if (!formatted) continue;
    result.push({
      label: FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: appendUnit(raw, key, formatted),
    });
  }
  return result;
}

export function isStructuredListing(property: {
  listingFor?: string;
  propertyType?: string;
  categoryFields?: Record<string, unknown>;
}): boolean {
  if (!property.propertyType) return false;
  if (property.propertyType === 'all-residential' || property.propertyType === 'all-commercial') return false;
  return Boolean(property.listingFor && Object.keys(property.categoryFields || {}).length > 0);
}

export function buildPropertyDisplaySections(property: {
  listingFor?: ListingFor | string;
  propertyType?: string;
  propertyCategory?: string;
  categoryFields?: Record<string, unknown>;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  possessionStatus?: string;
  possessionDate?: string;
}): PropertyDisplaySection[] {
  const cf = property.categoryFields || {};
  const sections: PropertyDisplaySection[] = [];

  const listingFields: PropertyDisplayField[] = [];
  const listingLabel = formatListingFor(property.listingFor);
  if (listingLabel) listingFields.push({ label: 'Listing Type', value: listingLabel });
  const typeLabel = getPropertyTypeLabel(property.propertyType || '');
  if (typeLabel) listingFields.push({ label: 'Property Type', value: typeLabel });
  if (property.bedrooms) listingFields.push({ label: 'Bedrooms', value: String(property.bedrooms) });
  if (property.bathrooms) listingFields.push({ label: 'Bathrooms', value: String(property.bathrooms) });
  if (property.area) listingFields.push({ label: 'Area', value: `${property.area} sq.ft` });
  if (listingFields.length) sections.push({ title: 'Listing Information', fields: listingFields });

  const locationFields = fieldsFromKeys(cf, ['landZone', 'idealForBusinesses']);
  if (locationFields.length) sections.push({ title: 'Property Location', fields: locationFields });

  const featureKeys = [
    'societyFlatsCount', 'bedrooms', 'balconies', 'floorNo', 'totalFloors', 'furnishedStatus',
    'washrooms', 'bathrooms', 'numberOfSeats', 'cabinMeetingRooms', 'personalWashroom', 'pantryCafeteria',
    'cornerShop', 'isMainRoadFacing', 'openSides', 'roadWidth', 'constructionDone', 'boundaryWall',
    'gatedColony', 'floorsAllowedConstruction', 'isCornerPlot',
  ];
  const featureFields = fieldsFromKeys(cf, featureKeys);
  if (featureFields.length) sections.push({ title: 'Property Features', fields: featureFields });

  const areaFields = fieldsFromKeys(cf, [
    'superArea', 'builtUpArea', 'carpetArea', 'coveredArea', 'plotArea', 'plotLength', 'plotBreadth',
  ]);
  if (areaFields.length) sections.push({ title: 'Area', fields: areaFields });

  if (property.listingFor === 'rent') {
    const rentFields = fieldsFromKeys(cf, [
      'availableFromType', 'availableFromDate', 'ageOfConstruction', 'currentlyRentOut',
      'monthlyRent', 'securityAmount', 'maintenanceCharges', 'maintenanceFrequency', 'brokerage',
    ]);
    if (cf.electricityWaterExcluded) {
      rentFields.push({ label: 'Utilities', value: 'Electricity & Water charges excluded' });
    }
    if (rentFields.length) sections.push({ title: 'Rent / Lease Details', fields: rentFields });
  } else {
    const transactionFields = fieldsFromKeys(cf, [
      'transactionType', 'possessionStatus', 'ageOfConstruction', 'availableFromMonth', 'availableFromYear',
      'currentlyLeasedOut', 'monthlyRent', 'leasedOn', 'currentBusinessSector', 'inBusinessSince',
      'assuredReturns', 'rateOfReturn',
    ]);
    if (property.possessionStatus && !transactionFields.some((f) => f.label === 'Possession Status')) {
      transactionFields.unshift({
        label: 'Possession Status',
        value: formatFieldValue('possessionStatus', property.possessionStatus) || property.possessionStatus,
      });
    }
    if (property.possessionDate) {
      transactionFields.push({ label: 'Possession Date', value: property.possessionDate });
    }
    if (transactionFields.length) {
      sections.push({ title: 'Transaction & Availability', fields: transactionFields });
    }

    const priceFields = fieldsFromKeys(cf, [
      'expectedPrice', 'pricePerSqft', 'basicPricePerSqft', 'floorPlcPerSqft', 'bookingTokenAmount',
      'maintenanceCharges', 'maintenanceFrequency', 'brokerage',
    ]);
    if (cf.priceIncludesPlc) priceFields.push({ label: 'Price Includes', value: 'PLC' });
    if (cf.priceIncludesCarParking) priceFields.push({ label: 'Price Includes', value: 'Car Parking' });
    if (cf.stampDutyExcluded) priceFields.push({ label: 'Stamp Duty', value: 'Excluded' });
    if (priceFields.length) sections.push({ title: 'Price Details', fields: priceFields });
  }

  return sections;
}

export function parseIndianPriceValue(value: string | number): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (!value) return 0;

  const normalized = value.trim().toLowerCase();
  if (/(\d[\d.,]*)\s*(cr|crore)\b/.test(normalized)) {
    const num = parseFloat(normalized.replace(/[^\d.]/g, ''));
    return num ? num * 10000000 : 0;
  }
  if (/(\d[\d.,]*)\s*(lac|lakh)\b/.test(normalized)) {
    const num = parseFloat(normalized.replace(/[^\d.]/g, ''));
    return num ? num * 100000 : 0;
  }

  const digitsOnly = value.replace(/[^\d.]/g, '');
  const num = parseFloat(digitsOnly);
  return Number.isFinite(num) ? num : 0;
}

/** Compact display: ₹ 57.07 Lac, ₹ 1.25 Cr — full `price` stays in DB for EMI. */
export function formatIndianPriceShort(amount: number): string {
  if (!amount || amount <= 0) return '';

  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} Lac`;
  }
  return formatInrCurrency(amount);
}

export function formatInrCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCalculatedPriceLabel(amount: number): string {
  if (!amount || amount <= 0) return '';
  return formatIndianPriceShort(amount);
}

function isRateBasedPriceLabel(value?: string): boolean {
  if (!value) return false;
  return /\/\s*sq[-.]?ft|per\s*sq/i.test(value);
}

export function normalizePricingRows(
  price: number,
  listingFor?: string,
  pricing?: Array<{ type: string; carpetArea?: string; price?: string }>,
  fallback?: { type?: string; carpetArea?: string }
) {
  const formatted = formatPropertyPrice(price, listingFor, pricing);
  const formatRowPrice = (rowPrice?: string) => {
    if (isRateBasedPriceLabel(rowPrice)) {
      return price > 0 ? formatted : rowPrice || formatted;
    }
    const parsed = rowPrice ? parseIndianPriceValue(rowPrice) : 0;
    if (parsed > 0) {
      const short = formatIndianPriceShort(parsed);
      return listingFor === 'rent' ? `${short}/month` : short;
    }
    if (rowPrice && !isRateBasedPriceLabel(rowPrice)) return rowPrice;
    return formatted;
  };

  if (pricing?.length) {
    return pricing.map((row) => ({
      type: row.type || fallback?.type || 'Standard',
      carpetArea: row.carpetArea || fallback?.carpetArea || '—',
      price: formatRowPrice(row.price),
    }));
  }
  if (price > 0) {
    return [
      {
        type: fallback?.type || 'Standard',
        carpetArea: fallback?.carpetArea || '—',
        price: formatted,
      },
    ];
  }
  return [];
}

export function formatPropertyPrice(
  price: number,
  listingFor?: string,
  pricing?: Array<{ price?: string }>
): string {
  const pricingPrice = pricing?.[0]?.price?.trim();

  if (price && price > 0) {
    const formatted = formatIndianPriceShort(price);
    return listingFor === 'rent' ? `${formatted}/month` : formatted;
  }

  if (pricingPrice && !isRateBasedPriceLabel(pricingPrice)) {
    const parsed = parseIndianPriceValue(pricingPrice);
    if (parsed > 0) {
      const formatted = formatIndianPriceShort(parsed);
      return listingFor === 'rent' ? `${formatted}/month` : formatted;
    }
    if (listingFor === 'rent' && !/\/month/i.test(pricingPrice)) {
      return `${pricingPrice}/month`;
    }
    return pricingPrice;
  }

  return 'Price on request';
}

export function getListingBadgeLabel(listingFor?: string): string {
  if (listingFor === 'rent') return 'For Rent';
  if (listingFor === 'pg') return 'PG / Hostel';
  return 'For Sale';
}
