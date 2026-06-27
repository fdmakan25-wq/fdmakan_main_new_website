import {
  getSaleListingCommonDefaults,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import { OPEN_SIDES_OPTIONS } from '@/lib/residential-house-sale-fields';

export type YesNo = 'yes' | 'no' | '';

export interface CommercialLandSaleFields extends SaleListingCommonFields {
  landZone: string;
  openSides: string;
  roadWidth: string;
  roadWidthUnit: string;
  boundaryWall: YesNo;
  plotArea: string;
  plotAreaUnit: string;
  plotLength: string;
  plotBreadth: string;
  plotDimensionUnit: string;
}

export { OPEN_SIDES_OPTIONS };

export function getCommercialLandSaleDefaults(): CommercialLandSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    landZone: '',
    openSides: '',
    roadWidth: '',
    roadWidthUnit: 'Meters',
    boundaryWall: '',
    plotArea: '',
    plotAreaUnit: 'Sq-yrd',
    plotLength: '',
    plotBreadth: '',
    plotDimensionUnit: 'yrd',
    transactionType: 'resale',
    possessionStatus: '',
  };
}

export function parseCommercialLandSaleFields(
  raw: Record<string, unknown> | undefined
): CommercialLandSaleFields {
  const defaults = getCommercialLandSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
  } as CommercialLandSaleFields;
}
