import { parseResidentialHouseSaleFields } from '@/lib/residential-house-sale-fields';
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

export function buildResidentialHouseSubmitPayload(
  formData: FormSlice,
  listingLabel = 'Residential House'
) {
  const house = parseResidentialHouseSaleFields(formData.categoryFields);
  return buildSaleListingSyncPayload(
    formData,
    house.plotArea,
    listingLabel,
    house.plotArea ? `${house.plotArea} ${house.plotAreaUnit}` : ''
  );
}

export function residentialHouseHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}
