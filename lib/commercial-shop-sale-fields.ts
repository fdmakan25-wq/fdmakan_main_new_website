import {
  getSaleListingCommonDefaults,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import {
  BUSINESS_SECTOR_OPTIONS,
  IN_BUSINESS_SINCE_OPTIONS,
  LAND_ZONE_OPTIONS,
  type OfficeFurnishedStatus,
  type PantryType,
  type YesNo,
} from '@/lib/commercial-office-space-sale-fields';

export type { YesNo, OfficeFurnishedStatus, PantryType };
export { LAND_ZONE_OPTIONS, BUSINESS_SECTOR_OPTIONS, IN_BUSINESS_SINCE_OPTIONS };

export interface CommercialShopSaleFields extends SaleListingCommonFields {
  landZone: string;
  idealForBusinesses: string;
  furnishedStatus: OfficeFurnishedStatus;
  cornerShop: YesNo;
  isMainRoadFacing: YesNo;
  personalWashroom: YesNo;
  pantryCafeteria: PantryType;
  superArea: string;
  superAreaUnit: string;
  builtUpArea: string;
  builtUpAreaUnit: string;
  showBuiltUpArea: boolean;
  carpetArea: string;
  carpetAreaUnit: string;
  currentlyLeasedOut: YesNo;
  monthlyRent: string;
  leasedOn: string;
  currentBusinessSector: string;
  inBusinessSince: string;
  assuredReturns: YesNo;
  rateOfReturn: string;
}

export function getCommercialShopSaleDefaults(): CommercialShopSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    landZone: '',
    idealForBusinesses: '',
    furnishedStatus: '',
    cornerShop: '',
    isMainRoadFacing: '',
    personalWashroom: '',
    pantryCafeteria: '',
    superArea: '',
    superAreaUnit: 'Sq-ft',
    builtUpArea: '',
    builtUpAreaUnit: 'Sq-ft',
    showBuiltUpArea: false,
    carpetArea: '',
    carpetAreaUnit: 'Sq-ft',
    currentlyLeasedOut: 'no',
    monthlyRent: '',
    leasedOn: '',
    currentBusinessSector: '',
    inBusinessSince: '',
    assuredReturns: 'no',
    rateOfReturn: '',
    transactionType: 'resale',
    possessionStatus: 'ready-to-move',
    priceIncludesPlc: false,
    priceIncludesCarParking: false,
    priceIncludesClubMembership: false,
  };
}

export function parseCommercialShopSaleFields(
  raw: Record<string, unknown> | undefined
): CommercialShopSaleFields {
  const defaults = getCommercialShopSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
  } as CommercialShopSaleFields;
}
