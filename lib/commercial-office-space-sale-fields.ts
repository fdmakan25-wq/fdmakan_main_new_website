import {
  getSaleListingCommonDefaults,
  getNumericOptions,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import { FLOOR_NO_OPTIONS } from '@/lib/flat-apartment-sale-fields';
import { COMMERCIAL_LAND_ZONE_OPTIONS } from '@/lib/commercial-land-zone-options';

export type YesNo = 'yes' | 'no' | '';
export type OfficeFurnishedStatus = 'furnished' | 'unfurnished' | '';
export type PantryType = 'dry' | 'wet' | 'not-available' | '';

export interface CommercialOfficeSpaceSaleFields extends SaleListingCommonFields {
  landZone: string;
  idealForBusinesses: string;
  floorNo: string;
  totalFloors: string;
  furnishedStatus: OfficeFurnishedStatus;
  washrooms: string;
  numberOfSeats: string;
  cabinMeetingRooms: string;
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

export { FLOOR_NO_OPTIONS };

export const LAND_ZONE_OPTIONS = COMMERCIAL_LAND_ZONE_OPTIONS;

export const CABIN_MEETING_ROOM_OPTIONS = ['0', '1', '2', '3', '4', '5', '6+'];

export const BUSINESS_SECTOR_OPTIONS = [
  'IT / ITES',
  'Banking & Finance',
  'Retail',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Consultancy',
  'Co-working',
  'Other',
];

export const IN_BUSINESS_SINCE_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
];

export function getCommercialOfficeSpaceSaleDefaults(): CommercialOfficeSpaceSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    landZone: '',
    idealForBusinesses: '',
    floorNo: '',
    totalFloors: '',
    furnishedStatus: '',
    washrooms: '0',
    numberOfSeats: '',
    cabinMeetingRooms: '',
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

export function parseCommercialOfficeSpaceSaleFields(
  raw: Record<string, unknown> | undefined
): CommercialOfficeSpaceSaleFields {
  const defaults = getCommercialOfficeSpaceSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
  } as CommercialOfficeSpaceSaleFields;
}

export function getOfficeFloorOptions() {
  return [...FLOOR_NO_OPTIONS, '5+'];
}

export function getOfficeTotalFloorOptions() {
  return [...getNumericOptions(13), '13+'];
}

export function getWashroomOptions() {
  return ['0', '1', '2', '3', '3+'];
}
