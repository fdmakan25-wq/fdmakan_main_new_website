import { AGE_OF_CONSTRUCTION_OPTIONS, BROKERAGE_OPTIONS, MAINTENANCE_FREQUENCY_OPTIONS } from '@/lib/sale-listing-common';

export type AvailableFromType = 'select-date' | 'immediately' | '';
export type YesNo = 'yes' | 'no' | '';

export interface RentListingFields {
  availableFromType: AvailableFromType;
  availableFromDate: string;
  ageOfConstruction: string;
  currentlyRentOut: YesNo;
  monthlyRent: string;
  electricityWaterExcluded: boolean;
  securityAmount: string;
  maintenanceCharges: string;
  maintenanceFrequency: string;
  brokerage: string;
}

export { AGE_OF_CONSTRUCTION_OPTIONS, BROKERAGE_OPTIONS, MAINTENANCE_FREQUENCY_OPTIONS };

export function getRentListingDefaults(): RentListingFields {
  return {
    availableFromType: 'immediately',
    availableFromDate: '',
    ageOfConstruction: '',
    currentlyRentOut: 'no',
    monthlyRent: '',
    electricityWaterExcluded: true,
    securityAmount: '',
    maintenanceCharges: '',
    maintenanceFrequency: 'Monthly',
    brokerage: '',
  };
}

export function mergeRentListingFields(raw: Record<string, unknown> | undefined): RentListingFields {
  const defaults = getRentListingDefaults();
  if (!raw) return defaults;
  return { ...defaults, ...raw } as RentListingFields;
}

export function parseRentListingFields(raw: Record<string, unknown> | undefined): RentListingFields {
  return mergeRentListingFields(raw);
}

export function rentListingHasPrice(
  categoryFields: Record<string, unknown>,
  price: number
): boolean {
  const fields = parseRentListingFields(categoryFields);
  return Boolean(fields.monthlyRent.trim() || (price && price > 0));
}
