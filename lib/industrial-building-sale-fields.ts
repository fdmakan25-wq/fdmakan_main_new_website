import {
  getSaleListingCommonDefaults,
  getNumericOptions,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import { COMMERCIAL_LAND_ZONE_OPTIONS } from '@/lib/commercial-land-zone-options';
import type { YesNo } from '@/lib/commercial-office-space-sale-fields';

export type { YesNo };
export { COMMERCIAL_LAND_ZONE_OPTIONS as LAND_ZONE_OPTIONS };

export interface IndustrialBuildingSaleFields extends SaleListingCommonFields {
  landZone: string;
  totalFloors: string;
  coveredArea: string;
  coveredAreaUnit: string;
  showPlotArea: boolean;
  plotArea: string;
  plotAreaUnit: string;
  currentlyLeasedOut: YesNo;
  monthlyRent: string;
  leasedOn: string;
  currentBusinessSector: string;
  inBusinessSince: string;
}

export function getIndustrialBuildingSaleDefaults(): IndustrialBuildingSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    landZone: '',
    totalFloors: '',
    coveredArea: '',
    coveredAreaUnit: 'Sq-ft',
    showPlotArea: false,
    plotArea: '',
    plotAreaUnit: 'Sq-yrd',
    currentlyLeasedOut: 'no',
    monthlyRent: '',
    leasedOn: '',
    currentBusinessSector: '',
    inBusinessSince: '',
    transactionType: 'resale',
    possessionStatus: 'ready-to-move',
    priceIncludesPlc: false,
    priceIncludesCarParking: false,
    priceIncludesClubMembership: false,
  };
}

export function parseIndustrialBuildingSaleFields(
  raw: Record<string, unknown> | undefined
): IndustrialBuildingSaleFields {
  const defaults = getIndustrialBuildingSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
  } as IndustrialBuildingSaleFields;
}

export function getIndustrialBuildingTotalFloorOptions() {
  return [...getNumericOptions(13), '13+'];
}
