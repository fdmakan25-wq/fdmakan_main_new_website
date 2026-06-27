'use client';

import { type ReactNode } from 'react';
import { getPropertyTypeLabel } from '@/lib/property-listing-options';
import type { ListingFor } from '@/lib/property-listing-options';
import SaleFlatApartmentForm from '@/components/dashboard/categories/SaleFlatApartmentForm';
import SaleResidentialHouseForm from '@/components/dashboard/categories/SaleResidentialHouseForm';
import SaleResidentialLandPlotForm from '@/components/dashboard/categories/SaleResidentialLandPlotForm';
import SaleCommercialOfficeSpaceForm from '@/components/dashboard/categories/SaleCommercialOfficeSpaceForm';
import SaleCommercialShopForm from '@/components/dashboard/categories/SaleCommercialShopForm';
import SaleCommercialLandForm from '@/components/dashboard/categories/SaleCommercialLandForm';
import SaleIndustrialLandForm from '@/components/dashboard/categories/SaleIndustrialLandForm';
import SaleIndustrialBuildingForm from '@/components/dashboard/categories/SaleIndustrialBuildingForm';
import RentListingSharedSections from '@/components/dashboard/categories/RentListingSharedSections';

interface PropertyCategoryFieldsProps {
  listingFor: ListingFor;
  propertyType: string;
  categoryFields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
}

const HOUSE_LIKE_TYPES = new Set([
  'residential-house',
  'villa',
  'penthouse',
  'studio-apartment',
]);

const COMMERCIAL_OFFICE_LIKE_TYPES = new Set([
  'commercial-office-space',
  'office-it-park-sez',
]);

const COMMERCIAL_LAND_LIKE_TYPES = new Set(['commercial-land', 'warehouse-godown']);

const INDUSTRIAL_BUILDING_LIKE_TYPES = new Set(['industrial-building', 'industrial-shed']);

function withRentSections(
  listingFor: ListingFor,
  categoryFields: Record<string, unknown>,
  onChange: (fields: Record<string, unknown>) => void,
  underlineInputClass: string,
  form: ReactNode
) {
  if (listingFor !== 'rent') return form;
  return (
    <div className="space-y-8">
      {form}
      <RentListingSharedSections
        fields={categoryFields}
        onChange={onChange}
        underlineInputClass={underlineInputClass}
      />
    </div>
  );
}

export default function PropertyCategoryFields({
  listingFor,
  propertyType,
  categoryFields,
  onChange,
  underlineInputClass,
}: PropertyCategoryFieldsProps) {
  if (!propertyType) return null;

  const isRent = listingFor === 'rent';
  const hideSaleSections = isRent;
  const commonProps = {
    fields: categoryFields,
    onChange,
    underlineInputClass,
    hideSaleSections,
  };

  if (propertyType === 'flat-apartment' && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleFlatApartmentForm {...commonProps} hidePhotos hideSocietyFlats />
    );
  }

  if (HOUSE_LIKE_TYPES.has(propertyType) && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleResidentialHouseForm {...commonProps} />
    );
  }

  if (listingFor === 'sale' && propertyType === 'residential-land-plot') {
    return <SaleResidentialLandPlotForm {...commonProps} />;
  }

  if (COMMERCIAL_OFFICE_LIKE_TYPES.has(propertyType) && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleCommercialOfficeSpaceForm {...commonProps} />
    );
  }

  if (propertyType === 'commercial-shop' && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleCommercialShopForm {...commonProps} />
    );
  }

  if (COMMERCIAL_LAND_LIKE_TYPES.has(propertyType) && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleCommercialLandForm {...commonProps} />
    );
  }

  if (propertyType === 'industrial-land' && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleIndustrialLandForm {...commonProps} />
    );
  }

  if (INDUSTRIAL_BUILDING_LIKE_TYPES.has(propertyType) && (listingFor === 'sale' || listingFor === 'rent')) {
    return withRentSections(
      listingFor,
      categoryFields,
      onChange,
      underlineInputClass,
      <SaleIndustrialBuildingForm {...commonProps} />
    );
  }

  if (isRent) {
    return (
      <RentListingSharedSections
        fields={categoryFields}
        onChange={onChange}
        underlineInputClass={underlineInputClass}
      />
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5">
      <h4 className="text-sm font-semibold text-gray-900 mb-1">Category-specific details</h4>
      <p className="text-sm text-gray-600">
        Additional inputs for{' '}
        <span className="font-medium text-gray-900">{getPropertyTypeLabel(propertyType)}</span>{' '}
        will appear here. Share the field list category-wise to enable them.
      </p>
    </div>
  );
}
