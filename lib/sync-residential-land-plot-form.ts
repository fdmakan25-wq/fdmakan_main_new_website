import { parseResidentialLandPlotSaleFields } from '@/lib/residential-land-plot-sale-fields';
import { buildSaleListingSyncPayload, saleListingHasPrice } from '@/lib/sale-listing-common';

type FormSlice = {
  price: number;
  area?: number;
  possessionStatus?: string;
  possessionDate?: string;
  images: string[];
  pricing: Array<{ type: string; carpetArea: string; price: string }>;
  categoryFields: Record<string, unknown>;
};

export function buildResidentialLandPlotSubmitPayload(formData: FormSlice) {
  const plot = parseResidentialLandPlotSaleFields(formData.categoryFields);
  const areaLabel = plot.plotArea
    ? `${plot.plotArea} ${plot.plotAreaUnit}`
    : plot.plotLength && plot.plotBreadth
      ? `${plot.plotLength} x ${plot.plotBreadth} ${plot.plotDimensionUnit}`
      : '';
  return buildSaleListingSyncPayload(
    formData,
    plot.plotArea,
    'Residential Plot',
    areaLabel
  );
}

export function residentialLandPlotHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}
