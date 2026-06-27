import {
  getSaleListingCommonDefaults,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';

export type CornerPlot = 'yes' | 'no' | '';

export interface ResidentialHouseSaleFields extends SaleListingCommonFields {
  floorsAllowedConstruction: string;
  openSides: string;
  roadWidth: string;
  roadWidthUnit: string;
  plotArea: string;
  plotAreaUnit: string;
  isCornerPlot: CornerPlot;
}

export const OPEN_SIDES_OPTIONS = ['1', '2', '3', '4'];

export function getResidentialHouseSaleDefaults(): ResidentialHouseSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    floorsAllowedConstruction: '',
    openSides: '',
    roadWidth: '',
    roadWidthUnit: 'Meters',
    plotArea: '',
    plotAreaUnit: 'Sq-ft',
    isCornerPlot: '',
  };
}

export function parseResidentialHouseSaleFields(
  raw: Record<string, unknown> | undefined
): ResidentialHouseSaleFields {
  const defaults = getResidentialHouseSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
  } as ResidentialHouseSaleFields;
}
