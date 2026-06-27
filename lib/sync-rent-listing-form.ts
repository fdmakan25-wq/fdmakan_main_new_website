import { parseRentListingFields } from '@/lib/rent-listing-common';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';

type FormSlice = {
  price: number;
  propertyType?: string;
  images: string[];
  pricing: Array<{ type: string; carpetArea: string; price: string }>;
  categoryFields: Record<string, unknown>;
};

export function buildRentSubmitPayload(formData: FormSlice) {
  const rent = parseRentListingFields(formData.categoryFields);
  const monthly = rent.monthlyRent.replace(/[^\d.]/g, '');
  const price = parseFloat(monthly) || formData.price;
  const label = getPropertyTypeLabel(formData.propertyType || '') || 'Rent';

  let pricing = formData.pricing;
  if (rent.monthlyRent.trim()) {
    pricing = [
      {
        type: label,
        carpetArea: '',
        price: `₹ ${rent.monthlyRent}/month`,
      },
    ];
  }

  return {
    ...formData,
    price: price > 0 ? price : formData.price,
    pricing,
  };
}
