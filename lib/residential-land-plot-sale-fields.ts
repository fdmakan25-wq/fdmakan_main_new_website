import {
  getSaleListingCommonDefaults,
  mergeSaleListingCommon,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import { OPEN_SIDES_OPTIONS } from '@/lib/residential-house-sale-fields';

export type YesNo = 'yes' | 'no' | '';

export interface ResidentialLandPlotSaleFields extends SaleListingCommonFields {
  floorsAllowedConstruction: string;
  openSides: string;
  roadWidth: string;
  roadWidthUnit: string;
  constructionDone: YesNo;
  boundaryWall: YesNo;
  gatedColony: YesNo;
  plotArea: string;
  plotAreaUnit: string;
  plotLength: string;
  plotBreadth: string;
  plotDimensionUnit: string;
  isCornerPlot: YesNo;
}

export { OPEN_SIDES_OPTIONS };

export function getResidentialLandPlotSaleDefaults(): ResidentialLandPlotSaleFields {
  return {
    ...getSaleListingCommonDefaults(),
    floorsAllowedConstruction: '',
    openSides: '',
    roadWidth: '',
    roadWidthUnit: 'Meters',
    constructionDone: '',
    boundaryWall: '',
    gatedColony: '',
    plotArea: '',
    plotAreaUnit: 'Sq-yrd',
    plotLength: '',
    plotBreadth: '',
    plotDimensionUnit: 'yrd',
    isCornerPlot: '',
    transactionType: 'resale',
    possessionStatus: '',
  };
}

export function parseResidentialLandPlotSaleFields(
  raw: Record<string, unknown> | undefined
): ResidentialLandPlotSaleFields {
  const defaults = getResidentialLandPlotSaleDefaults();
  if (!raw) return defaults;
  return {
    ...defaults,
    ...mergeSaleListingCommon(raw),
    ...raw,
  } as ResidentialLandPlotSaleFields;
}
