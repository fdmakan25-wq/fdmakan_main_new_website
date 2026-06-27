import { parseIndustrialLandSaleFields } from '@/lib/industrial-land-sale-fields';
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

export function buildIndustrialLandSubmitPayload(formData: FormSlice) {
  const plot = parseIndustrialLandSaleFields(formData.categoryFields);
  const areaLabel = plot.plotArea
    ? `${plot.plotArea} ${plot.plotAreaUnit}`
    : plot.plotLength && plot.plotBreadth
      ? `${plot.plotLength} x ${plot.plotBreadth} ${plot.plotDimensionUnit}`
      : '';
  return buildSaleListingSyncPayload(formData, plot.plotArea, 'Industrial Land', areaLabel);
}

export function industrialLandHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}
