import { parseCommercialLandSaleFields } from '@/lib/commercial-land-sale-fields';
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

export function buildCommercialLandLikeSubmitPayload(
  formData: FormSlice,
  pricingLabel: string
) {
  const plot = parseCommercialLandSaleFields(formData.categoryFields);
  const areaLabel = plot.plotArea
    ? `${plot.plotArea} ${plot.plotAreaUnit}`
    : plot.plotLength && plot.plotBreadth
      ? `${plot.plotLength} x ${plot.plotBreadth} ${plot.plotDimensionUnit}`
      : '';
  return buildSaleListingSyncPayload(formData, plot.plotArea, pricingLabel, areaLabel);
}

export function buildCommercialLandSubmitPayload(formData: FormSlice) {
  return buildCommercialLandLikeSubmitPayload(formData, 'Commercial Land');
}

export function buildWarehouseGodownSubmitPayload(formData: FormSlice) {
  return buildCommercialLandLikeSubmitPayload(formData, 'Warehouse/ Godown');
}

export function commercialLandHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}

export function warehouseGodownHasPrice(formData: FormSlice): boolean {
  return commercialLandHasPrice(formData);
}
