import {
  formatCalculatedPriceLabel,
  formatIndianPriceShort,
  parseIndianPriceValue,
} from '@/lib/property-details-display';

export type TransactionType = 'new' | 'resale' | '';
export type PossessionStatus = 'under-construction' | 'ready-to-move' | '';

export interface SaleListingCommonFields {
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

export const AGE_OF_CONSTRUCTION_OPTIONS = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
];
export const BROKERAGE_OPTIONS = ['None', '0.5%', '1%', '1.5%', '2%', 'Custom'];
export const MAINTENANCE_FREQUENCY_OPTIONS = [
  'Monthly',
  'Quarterly',
  'Yearly',
  'One-Time',
  'Per sq. Unit Monthly',
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

export function getNumericOptions(count: number) {
  return Array.from({ length: count }, (_, i) => String(i + 1));
}

export function formatListingPriceLabel(
  expectedPrice: string,
  basicPricePerSqft: string,
  areaNum: number,
  calculatedPrice: number
): string {
  if (expectedPrice.trim()) {
    const parsed = parseIndianPriceValue(expectedPrice);
    if (parsed > 0) return formatIndianPriceShort(parsed);
    return expectedPrice.startsWith('₹') ? expectedPrice : `₹ ${expectedPrice}`;
  }
  if (basicPricePerSqft.trim() && calculatedPrice > 0) {
    return formatCalculatedPriceLabel(calculatedPrice);
  }
  if (basicPricePerSqft.trim()) {
    return `₹ ${basicPricePerSqft}/sqft`;
  }
  return '';
}

export function getSaleListingCommonDefaults(): SaleListingCommonFields {
  return {
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

export function mergeSaleListingCommon(raw: Record<string, unknown> | undefined): SaleListingCommonFields {
  const defaults = getSaleListingCommonDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...raw,
    photoCategories:
      raw.photoCategories && typeof raw.photoCategories === 'object'
        ? { ...defaults.photoCategories, ...(raw.photoCategories as Record<string, string[]>) }
        : defaults.photoCategories,
  } as SaleListingCommonFields;
}

export function saleListingHasPrice(
  categoryFields: Record<string, unknown>,
  price: number,
  pricing: Array<{ type: string; carpetArea: string; price: string }>
): boolean {
  const fields = mergeSaleListingCommon(categoryFields);
  return Boolean(
    fields.expectedPrice.trim() ||
      fields.basicPricePerSqft.trim() ||
      (price && price > 0) ||
      (pricing && pricing.length > 0)
  );
}

export function buildSaleListingSyncPayload(
  formData: {
    price: number;
    area?: number;
    possessionStatus?: string;
    possessionDate?: string;
    images: string[];
    pricing: Array<{ type: string; carpetArea: string; price: string }>;
    categoryFields: Record<string, unknown>;
  },
  areaValue: string,
  pricingLabel: string,
  areaLabel: string
) {
  const common = mergeSaleListingCommon(formData.categoryFields);

  let price = formData.price;
  const expected = common.expectedPrice.replace(/[^\d.]/g, '');
  const basicPerSqft = common.basicPricePerSqft.replace(/[^\d.]/g, '');
  const areaNum = parseFloat(areaValue || '0') || 0;

  if (expected) {
    price = parseFloat(expected) || price;
  } else if (basicPerSqft && areaNum) {
    price = parseFloat(basicPerSqft) * areaNum;
  }

  const area = areaNum > 0 ? Math.round(areaNum) : formData.area;
  const possessionStatus =
    common.possessionStatus === 'ready-to-move' ? 'Ready to Move' : 'Under Construction';
  const possessionDate =
    common.possessionStatus === 'under-construction' &&
    common.availableFromMonth &&
    common.availableFromYear
      ? `${common.availableFromMonth.slice(0, 3)}-${common.availableFromYear}`
      : formData.possessionDate;

  const categorizedImages = Object.values(common.photoCategories).flat();
  const images = [...new Set([...formData.images, ...categorizedImages])];

  let pricing = formData.pricing;
  if (pricingLabel && (common.expectedPrice || common.basicPricePerSqft)) {
    const priceLabel = formatListingPriceLabel(
      common.expectedPrice,
      common.basicPricePerSqft,
      areaNum,
      price
    );
    if (priceLabel) {
      pricing = [
        {
          type: pricingLabel,
          carpetArea: areaLabel,
          price: priceLabel,
        },
      ];
    }
  }

  return {
    ...formData,
    price: price > 0 ? price : formData.price,
    area,
    possessionStatus,
    possessionDate,
    images,
    pricing,
  };
}
