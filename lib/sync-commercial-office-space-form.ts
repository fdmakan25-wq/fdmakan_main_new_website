import { parseCommercialOfficeSpaceSaleFields } from '@/lib/commercial-office-space-sale-fields';
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

export function buildCommercialOfficeSpaceSubmitPayload(
  formData: FormSlice,
  pricingLabel = 'Commercial Office Space'
) {
  const office = parseCommercialOfficeSpaceSaleFields(formData.categoryFields);
  const areaValue = office.superArea || office.carpetArea || office.builtUpArea;
  const areaLabel = areaValue
    ? `${areaValue} ${office.superArea ? office.superAreaUnit : office.carpetArea ? office.carpetAreaUnit : office.builtUpAreaUnit}`
    : office.numberOfSeats
      ? `${office.numberOfSeats} seats`
      : '';
  return buildSaleListingSyncPayload(formData, areaValue, pricingLabel, areaLabel);
}

export function commercialOfficeSpaceHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}
