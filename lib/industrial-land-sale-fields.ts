import {
  getSaleListingCommonDefaults,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import { OPEN_SIDES_OPTIONS } from '@/lib/residential-house-sale-fields';

export type YesNo = 'yes' | 'no' | '';

export interface IndustrialLandSaleFields extends SaleListingCommonFields {
  openSides: string;
  roadWidth: string;
  roadWidthUnit: string;
  constructionDone: YesNo;
  boundaryWall: YesNo;
  plotArea: string;
  plotAreaUnit: string;
  plotLength: string;
  plotBreadth: string;
  plotDimensionUnit: string;
  isCornerPlot: boolean;
}

export { OPEN_SIDES_OPTIONS };

export function getIndustrialLandSaleDefaults(): IndustrialLandSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    openSides: '',
    roadWidth: '',
    roadWidthUnit: 'Meters',
    constructionDone: '',
    boundaryWall: '',
    plotArea: '',
    plotAreaUnit: 'Sq-yrd',
    plotLength: '',
    plotBreadth: '',
    plotDimensionUnit: 'yrd',
    isCornerPlot: false,
    transactionType: 'resale',
    possessionStatus: '',
  };
}

export function parseIndustrialLandSaleFields(
  raw: Record<string, unknown> | undefined
): IndustrialLandSaleFields {
  const defaults = getIndustrialLandSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
    isCornerPlot: Boolean(raw.isCornerPlot),
  } as IndustrialLandSaleFields;
}
