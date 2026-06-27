export type SocietyFlatsCount = '<50' | '50-100' | '>100' | '';
export type FurnishedStatus = 'furnished' | 'unfurnished' | 'semi-furnished' | '';
export type TransactionType = 'new' | 'resale' | '';
export type PossessionStatus = 'under-construction' | 'ready-to-move' | '';

export interface BedroomSize {
  length: string;
  breadth: string;
}

export interface FlatApartmentSaleFields {
  societyFlatsCount: SocietyFlatsCount;
  projectSocietyName: string;
  bedrooms: string;
  bedroomSizes: BedroomSize[];
  balconies: string;
  floorNo: string;
  totalFloors: string;
  furnishedStatus: FurnishedStatus;
  bathrooms: string;
  floorsAllowedConstruction: string;
  superArea: string;
  superAreaUnit: string;
  builtUpArea: string;
  builtUpAreaUnit: string;
  showBuiltUpArea: boolean;
  carpetArea: string;
  carpetAreaUnit: string;
  transactionType: TransactionType;
  possessionStatus: PossessionStatus;
  availableFromMonth: string;
  availableFromYear: string;
  ageOfConstruction: string;
  basicPricePerSqft: string;
  floorPlcPerSqft: string;
  expectedPrice: string;
  pricePerSqft: string;
  priceIncludesPlc: boolean;
  priceIncludesCarParking: boolean;
  priceIncludesClubMembership: boolean;
  stampDutyExcluded: boolean;
  bookingTokenAmount: string;
  maintenanceCharges: string;
  maintenanceFrequency: string;
  brokerage: string;
  noBrokerResponse: boolean;
  photoCategories: Record<string, string[]>;
}

export const SOCIETY_FLATS_OPTIONS: SocietyFlatsCount[] = ['<50', '50-100', '>100'];
export const FURNISHED_OPTIONS: { value: FurnishedStatus; label: string }[] = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
];
export const FLOOR_NO_OPTIONS = [
  'Lower Basement',
  'Upper Basement',
  'Ground',
  '1',
  '2',
  '3',
  '4',
  '5',
];
export const PHOTO_TABS = [
  'Exterior View',
  'Living Room',
  'Bedrooms',
  'Bathrooms',
  'Kitchen',
  'Floor Plan',
  'Master Plan',
  'Location Map',
  'Others',
];
export const AGE_OF_CONSTRUCTION_OPTIONS = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
];
export const BROKERAGE_OPTIONS = ['None', '0.5%', '1%', '1.5%', '2%', 'Custom'];
export { MAINTENANCE_FREQUENCY_OPTIONS } from '@/lib/sale-listing-common';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function getMonthOptions() {
  return MONTHS;
}

export function getYearOptions() {
  const current = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, i) => String(current + i));
}

export function getNumericOptions(count: number, plusLabel?: string) {
  const options = Array.from({ length: count }, (_, i) => String(i + 1));
  if (plusLabel) options.push(plusLabel);
  return options;
}

export function getFlatApartmentSaleDefaults(): FlatApartmentSaleFields {
  return {
    societyFlatsCount: '',
    projectSocietyName: '',
    bedrooms: '',
    bedroomSizes: [],
    balconies: '0',
    floorNo: '',
    totalFloors: '',
    furnishedStatus: '',
    bathrooms: '1',
    floorsAllowedConstruction: '',
    superArea: '',
    superAreaUnit: 'Sq-ft',
    builtUpArea: '',
    builtUpAreaUnit: 'Sq-ft',
    showBuiltUpArea: false,
    carpetArea: '',
    carpetAreaUnit: 'Sq-ft',
    transactionType: 'new',
    possessionStatus: 'under-construction',
    availableFromMonth: '',
    availableFromYear: '',
    ageOfConstruction: '',
    basicPricePerSqft: '',
    floorPlcPerSqft: '',
    expectedPrice: '',
    pricePerSqft: '',
    priceIncludesPlc: false,
    priceIncludesCarParking: false,
    priceIncludesClubMembership: false,
    stampDutyExcluded: true,
    bookingTokenAmount: '',
    maintenanceCharges: '',
    maintenanceFrequency: 'Monthly',
    brokerage: '',
    noBrokerResponse: false,
    photoCategories: Object.fromEntries(PHOTO_TABS.map((tab) => [tab, []])),
  };
}

export function parseFlatApartmentSaleFields(
  raw: Record<string, unknown> | undefined
): FlatApartmentSaleFields {
  const defaults = getFlatApartmentSaleDefaults();
  if (!raw) return defaults;

  return {
    ...defaults,
    ...raw,
    bedroomSizes: Array.isArray(raw.bedroomSizes)
      ? (raw.bedroomSizes as BedroomSize[])
      : defaults.bedroomSizes,
    photoCategories:
      raw.photoCategories && typeof raw.photoCategories === 'object'
        ? { ...defaults.photoCategories, ...(raw.photoCategories as Record<string, string[]>) }
        : defaults.photoCategories,
  } as FlatApartmentSaleFields;
}

export function bedroomCountFromValue(value: string): number {
  if (!value) return 0;
  if (value.endsWith('+')) return parseInt(value, 10) || 5;
  return parseInt(value, 10) || 0;
}

export function syncBedroomSizes(count: number, existing: BedroomSize[]): BedroomSize[] {
  return Array.from({ length: count }, (_, i) => existing[i] || { length: '', breadth: '' });
}
