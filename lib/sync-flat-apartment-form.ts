import {
  bedroomCountFromValue,
  parseFlatApartmentSaleFields,
} from '@/lib/flat-apartment-sale-fields';

type FormSlice = {
  price: number;
  bedrooms?: number;
  area?: number;
  possessionStatus?: string;
  possessionDate?: string;
  images: string[];
  pricing: Array<{ type: string; carpetArea: string; price: string }>;
  categoryFields: Record<string, unknown>;
};

export function buildFlatApartmentSubmitPayload(formData: FormSlice): FormSlice & {
  price: number;
  bedrooms?: number;
  area?: number;
  possessionStatus?: string;
  possessionDate?: string;
  images: string[];
  pricing: Array<{ type: string; carpetArea: string; price: string }>;
} {
  const flat = parseFlatApartmentSaleFields(formData.categoryFields);

  let price = formData.price;
  const expected = flat.expectedPrice.replace(/[^\d.]/g, '');
  const basicPerSqft = flat.basicPricePerSqft.replace(/[^\d.]/g, '');
  const areaNum = parseFloat(flat.superArea || flat.carpetArea || '0') || 0;

  if (expected) {
    price = parseFloat(expected) || price;
  } else if (basicPerSqft && areaNum) {
    price = parseFloat(basicPerSqft) * areaNum;
  }

  const bedrooms = bedroomCountFromValue(flat.bedrooms) || undefined;
  const area = areaNum > 0 ? Math.round(areaNum) : formData.area;

  const possessionStatus =
    flat.possessionStatus === 'ready-to-move' ? 'Ready to Move' : 'Under Construction';
  const possessionDate =
    flat.possessionStatus === 'under-construction' && flat.availableFromMonth && flat.availableFromYear
      ? `${flat.availableFromMonth.slice(0, 3)}-${flat.availableFromYear}`
      : formData.possessionDate;

  const categorizedImages = Object.values(flat.photoCategories).flat();
  const images = [...new Set([...formData.images, ...categorizedImages])];

  let pricing = formData.pricing;
  if (flat.bedrooms && (flat.expectedPrice || flat.basicPricePerSqft)) {
    const priceLabel = flat.expectedPrice
      ? `₹ ${flat.expectedPrice}`
      : flat.basicPricePerSqft
        ? `₹ ${flat.basicPricePerSqft}/sqft`
        : '';
    pricing = [
      {
        type: `${flat.bedrooms} BHK`,
        carpetArea: flat.carpetArea ? `${flat.carpetArea} ${flat.carpetAreaUnit}` : '',
        price: priceLabel,
      },
    ];
  }

  return {
    ...formData,
    price: price > 0 ? price : formData.price,
    bedrooms,
    area,
    possessionStatus,
    possessionDate,
    images,
    pricing,
    categoryFields: {
      ...flat,
      projectSocietyName: flat.projectSocietyName,
    },
  };
}

export function flatApartmentHasPrice(formData: FormSlice): boolean {
  const flat = parseFlatApartmentSaleFields(formData.categoryFields);
  return Boolean(
    flat.expectedPrice.trim() ||
      flat.basicPricePerSqft.trim() ||
      (formData.price && formData.price > 0) ||
      (formData.pricing && formData.pricing.length > 0)
  );
}
