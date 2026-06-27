import { parseCommercialShopSaleFields } from '@/lib/commercial-shop-sale-fields';
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

export function buildCommercialShopSubmitPayload(formData: FormSlice) {
  const shop = parseCommercialShopSaleFields(formData.categoryFields);
  const areaValue = shop.superArea || shop.carpetArea || shop.builtUpArea;
  const areaLabel = areaValue
    ? `${areaValue} ${shop.superArea ? shop.superAreaUnit : shop.carpetArea ? shop.carpetAreaUnit : shop.builtUpAreaUnit}`
    : '';
  return buildSaleListingSyncPayload(formData, areaValue, 'Commercial Shop', areaLabel);
}

export function commercialShopHasPrice(formData: FormSlice): boolean {
  return saleListingHasPrice(formData.categoryFields, formData.price, formData.pricing);
}
