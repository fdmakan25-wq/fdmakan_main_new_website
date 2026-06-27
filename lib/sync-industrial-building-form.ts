import { parseIndustrialBuildingSaleFields } from '@/lib/industrial-building-sale-fields';
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

export function buildIndustrialBuildingLikeSubmitPayload(
  formData: FormSlice,
  pricingLabel = 'Industrial Building'
) {
  const building = parseIndustrialBuildingSaleFields(formData.categoryFields);
  const areaValue = building.coveredArea || building.plotArea;
  const areaLabel = building.coveredArea
    ? `${building.coveredArea} ${building.coveredAreaUnit} covered`
    : building.plotArea
      ? `${building.plotArea} ${building.plotAreaUnit} plot`
      : building.totalFloors
        ? `${building.totalFloors} floors`
        : '';
  return buildSaleListingSyncPayload(formData, areaValue, pricingLabel, areaLabel);
}

export function buildIndustrialBuildingSubmitPayload(formData: FormSlice) {
  return buildIndustrialBuildingLikeSubmitPayload(formData, 'Industrial Building');
}

export function buildIndustrialShedSubmitPayload(formData: FormSlice) {
  return buildIndustrialBuildingLikeSubmitPayload(formData, 'Industrial Shed');
}

export function industrialBuildingHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}
