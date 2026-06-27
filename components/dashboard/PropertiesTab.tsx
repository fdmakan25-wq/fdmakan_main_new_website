'use client';

import { useState, useEffect } from 'react';
import { EXTERNAL_AMENITIES } from '@/lib/constants';
import {
  STRUCTURE_QUALITY_OPTIONS,
  LIVING_DINING_FLOORING_OPTIONS,
  BATHROOM_FLOORING_OPTIONS,
  KITCHEN_FLOORING_OPTIONS,
  BATHROOM_FITTING_OPTIONS,
  DOOR_OPTIONS,
  WINDOW_OPTIONS,
} from '@/lib/specification-options';
import {
  LISTING_FOR_OPTIONS,
  getPropertyCategoryForType,
  getPropertyTypeLabel,
  getPropertyTypesForCategory,
  type ListingFor,
  type PropertyCategory,
} from '@/lib/property-listing-options';
import {
  getFlatApartmentSaleDefaults,
  SOCIETY_FLATS_OPTIONS,
  PHOTO_TABS,
  parseFlatApartmentSaleFields,
} from '@/lib/flat-apartment-sale-fields';
import { getResidentialHouseSaleDefaults } from '@/lib/residential-house-sale-fields';
import { getResidentialLandPlotSaleDefaults } from '@/lib/residential-land-plot-sale-fields';
import { getCommercialOfficeSpaceSaleDefaults } from '@/lib/commercial-office-space-sale-fields';
import { getCommercialShopSaleDefaults } from '@/lib/commercial-shop-sale-fields';
import { getCommercialLandSaleDefaults } from '@/lib/commercial-land-sale-fields';
import { getIndustrialLandSaleDefaults } from '@/lib/industrial-land-sale-fields';
import { getIndustrialBuildingSaleDefaults } from '@/lib/industrial-building-sale-fields';
import { mergeSaleListingCommon } from '@/lib/sale-listing-common';
import { getRentListingDefaults, rentListingHasPrice } from '@/lib/rent-listing-common';
import { buildRentSubmitPayload } from '@/lib/sync-rent-listing-form';
import {
  buildFlatApartmentSubmitPayload,
  flatApartmentHasPrice,
} from '@/lib/sync-flat-apartment-form';
import {
  buildResidentialHouseSubmitPayload,
  residentialHouseHasPrice,
} from '@/lib/sync-residential-house-form';
import {
  buildResidentialLandPlotSubmitPayload,
  residentialLandPlotHasPrice,
} from '@/lib/sync-residential-land-plot-form';
import {
  buildCommercialOfficeSpaceSubmitPayload,
  commercialOfficeSpaceHasPrice,
} from '@/lib/sync-commercial-office-space-form';
import {
  buildCommercialShopSubmitPayload,
  commercialShopHasPrice,
} from '@/lib/sync-commercial-shop-form';
import {
  buildCommercialLandSubmitPayload,
  buildWarehouseGodownSubmitPayload,
  commercialLandHasPrice,
} from '@/lib/sync-commercial-land-form';
import {
  buildIndustrialLandSubmitPayload,
  industrialLandHasPrice,
} from '@/lib/sync-industrial-land-form';
import {
  buildIndustrialBuildingLikeSubmitPayload,
  industrialBuildingHasPrice,
} from '@/lib/sync-industrial-building-form';

const SALE_HOUSE_LIKE_TYPES = new Set([
  'residential-house',
  'villa',
  'penthouse',
  'studio-apartment',
]);

const SALE_COMMERCIAL_OFFICE_LIKE_TYPES = new Set([
  'commercial-office-space',
  'office-it-park-sez',
]);

const SALE_COMMERCIAL_LAND_LIKE_TYPES = new Set(['commercial-land', 'warehouse-godown']);

const SALE_INDUSTRIAL_BUILDING_LIKE_TYPES = new Set(['industrial-building', 'industrial-shed']);

function asCategoryFields(value: object): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function getSaleCategoryDefaults(propertyType: string, propertyName: string): Record<string, unknown> {
  if (propertyType === 'flat-apartment') {
    return { ...getFlatApartmentSaleDefaults(), projectSocietyName: propertyName };
  }
  if (SALE_HOUSE_LIKE_TYPES.has(propertyType)) {
    return asCategoryFields(getResidentialHouseSaleDefaults());
  }
  if (propertyType === 'residential-land-plot') {
    return asCategoryFields(getResidentialLandPlotSaleDefaults());
  }
  if (propertyType === 'commercial-office-space' || propertyType === 'office-it-park-sez') {
    return asCategoryFields(getCommercialOfficeSpaceSaleDefaults());
  }
  if (propertyType === 'commercial-shop') {
    return asCategoryFields(getCommercialShopSaleDefaults());
  }
  if (SALE_COMMERCIAL_LAND_LIKE_TYPES.has(propertyType)) {
    return asCategoryFields(getCommercialLandSaleDefaults());
  }
  if (propertyType === 'industrial-land') {
    return asCategoryFields(getIndustrialLandSaleDefaults());
  }
  if (SALE_INDUSTRIAL_BUILDING_LIKE_TYPES.has(propertyType)) {
    return asCategoryFields(getIndustrialBuildingSaleDefaults());
  }
  return {};
}

function getRentCategoryDefaults(propertyType: string, propertyName: string): Record<string, unknown> {
  return {
    ...getSaleCategoryDefaults(propertyType, propertyName),
    ...getRentListingDefaults(),
  };
}

function getCategoryDefaultsForEdit(property: Property): Record<string, unknown> {
  if (property.listingFor === 'rent') {
    return {
      ...getRentCategoryDefaults(property.propertyType || '', property.name),
      ...(property.categoryFields || {}),
    };
  }
  return getSaleCategoryDefaultsForEdit(property);
}

function getSaleCategoryDefaultsForEdit(property: Property): Record<string, unknown> {
  if (property.propertyType === 'flat-apartment') {
    return {
      ...getFlatApartmentSaleDefaults(),
      ...(property.categoryFields || {}),
      projectSocietyName:
        (property.categoryFields?.projectSocietyName as string) || property.name || '',
    };
  }
  if (property.propertyType && SALE_HOUSE_LIKE_TYPES.has(property.propertyType)) {
    return { ...getResidentialHouseSaleDefaults(), ...(property.categoryFields || {}) };
  }
  if (property.propertyType === 'residential-land-plot') {
    return { ...getResidentialLandPlotSaleDefaults(), ...(property.categoryFields || {}) };
  }
  if (property.propertyType === 'commercial-office-space' || property.propertyType === 'office-it-park-sez') {
    return { ...getCommercialOfficeSpaceSaleDefaults(), ...(property.categoryFields || {}) };
  }
  if (property.propertyType === 'commercial-shop') {
    return { ...getCommercialShopSaleDefaults(), ...(property.categoryFields || {}) };
  }
  if (property.propertyType && SALE_COMMERCIAL_LAND_LIKE_TYPES.has(property.propertyType)) {
    return { ...getCommercialLandSaleDefaults(), ...(property.categoryFields || {}) };
  }
  if (property.propertyType === 'industrial-land') {
    return { ...getIndustrialLandSaleDefaults(), ...(property.categoryFields || {}) };
  }
  if (property.propertyType && SALE_INDUSTRIAL_BUILDING_LIKE_TYPES.has(property.propertyType)) {
    return { ...getIndustrialBuildingSaleDefaults(), ...(property.categoryFields || {}) };
  }
  return property.categoryFields || {};
}
import PropertyCategoryFields from '@/components/dashboard/PropertyCategoryFields';
import SegmentButtonGroup from '@/components/dashboard/form/SegmentButtonGroup';
import { formatPropertyPrice } from '@/lib/property-details-display';
import { handleNumericInputChange } from '@/lib/dashboard-measurements';

interface Property {
  _id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  location: string;
  city?: string;
  locality?: string;
  listingCity?: string;
  listingFor?: ListingFor;
  propertyCategory?: PropertyCategory | '';
  propertyType?: string;
  categoryFields?: Record<string, unknown>;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  available: boolean;
  images: string[];
  videos?: string[];
  showInTopSelling?: boolean;
  showInPremium?: boolean;
  showInNewlyLaunched?: boolean;
  featured?: boolean;
  // Highlights section
  highlights?: string[];
  // Overview section
  storeys?: string;
  projectArea?: string;
  possessionStatus?: string;
  advertiserReraNumber?: string;
  possessionDate?: string;
  projectReraNumber?: string;
  address?: string;
  // Pricing section
  pricing?: Array<{
    type: string;
    carpetArea: string;
    price: string;
  }>;
  // Amenities & Facilities
  amenities?: string[];
  facilities?: string[];
  // Specifications
  specifications?: {
    structureQuality?: string;
    floor?: { [key: string]: string };
    fitting?: { [key: string]: string };
  };
  // Connectivity
  connectivity?: {
    commute?: Array<{ name: string; distance: string; time: string }>;
    entertainment?: Array<{ name: string; distance: string; time: string }>;
    essentials?: Array<{ name: string; distance: string; time: string }>;
  };
  reraQrCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface Developer {
  _id: string;
  name: string;
}

interface LocationItem {
  _id: string;
  name: string;
  cityId: string | null;
}

interface CityWithLocations {
  _id: string;
  name: string;
  locations: LocationItem[];
}

export default function PropertiesTab() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [cities, setCities] = useState<CityWithLocations[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
    fetchDevelopers();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/cities');
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await fetch('/api/developers');
      if (response.ok) {
        const data = await response.json();
        setDevelopers(data);
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      console.log('Fetched properties:', data.length);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete property');
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading properties...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-2">Manage your property listings</p>
        </div>
        <button
          onClick={handleAddProperty}
          className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition shadow-lg"
        >
          + Add Property
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first property</p>
            <button
              onClick={handleAddProperty}
              className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition"
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {property.images && property.images.length > 0 && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                            <img
                              src={property.images[0]}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.name}</div>
                          <div className="text-xs text-gray-500">ID: {property._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-brand-teal/10 text-brand-teal rounded-full">
                        {property.developer || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPropertyPrice(property.price, property.listingFor, property.pricing)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {property.featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            NEW
                          </span>
                        )}
                        {!property.available && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.open(`/view-details/${property._id}`, '_blank')}
                          className="text-brand-teal hover:text-brand-teal-dark"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      {showModal && (
        <PropertyFormModal
          property={editingProperty}
          developers={developers}
          cities={cities}
          onClose={() => {
            setShowModal(false);
            setEditingProperty(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingProperty(null);
            fetchProperties();
          }}
        />
      )}
    </div>
  );
}

// Property Form Modal Component
function PropertyFormModal({
  property,
  developers,
  cities,
  onClose,
  onSuccess,
}: {
  property: Property | null;
  developers: Developer[];
  cities: CityWithLocations[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const initialPropertyType =
    property?.propertyType === 'all-residential' || property?.propertyType === 'all-commercial'
      ? ''
      : property?.propertyType || '';

  const [formData, setFormData] = useState({
    name: property?.name || '',
    description: property?.description || '',
    price: property?.price || 0,
    developer: property?.developer || '',
    city: property?.city || property?.listingCity || '',
    location: property?.location || property?.locality || '',
    listingFor: (property?.listingFor || 'sale') as ListingFor,
    propertyCategory: (property?.propertyCategory ||
      getPropertyCategoryForType(initialPropertyType || property?.propertyType || '')) as PropertyCategory | '',
    propertyType: initialPropertyType,
    categoryFields: property ? getCategoryDefaultsForEdit(property) : {},
    available: property?.available ?? true,
    images: property?.images || [],
    videos: property?.videos || [],
    showInTopSelling: property?.showInTopSelling || false,
    showInPremium: property?.showInPremium || false,
    showInNewlyLaunched: property?.showInNewlyLaunched || false,
    // Highlights
    highlights: property?.highlights || [],
    // Overview
    storeys: property?.storeys || '',
    projectArea: property?.projectArea || '',
    possessionStatus: property?.possessionStatus || '',
    advertiserReraNumber: property?.advertiserReraNumber || '',
    possessionDate: property?.possessionDate || '',
    projectReraNumber: property?.projectReraNumber || '',
    address: property?.address || '',
    // Pricing
    pricing: property?.pricing || [],
    // Amenities & Facilities
    amenities: property?.amenities || [],
    facilities: property?.facilities || [],
    // Specifications
    specifications: property?.specifications || {
      structureQuality: '',
      floor: {},
      fitting: {},
    },
    // Connectivity
    connectivity: property?.connectivity || {
      commute: [],
      entertainment: [],
      essentials: [],
    },
    reraQrCode: property?.reraQrCode || '',
  });

  // State for managing dynamic inputs
  const [highlightInput, setHighlightInput] = useState('');
  // const [amenityInput, setAmenityInput] = useState(''); // Removed in favor of checkboxes
  const [facilityInput, setFacilityInput] = useState('');
  const [pricingInput, setPricingInput] = useState({
    bhkCount: '2',
    unitType: 'BHK' as 'BHK' | 'RK',
    areaValue: '',
    areaUnit: 'Sq.ft' as 'Sq.ft' | 'Sq.m',
    price: '',
  });

  const formatPriceWithRupee = (value: string) => {
    const cleaned = value.replace(/[₹,\s]/g, '').trim();
    if (!cleaned) return '';
    return `₹ ${cleaned}`;
  };

  const addPricingEntry = () => {
    if (!pricingInput.areaValue || !pricingInput.price) {
      alert('Please enter area and price');
      return;
    }
    const type = `${pricingInput.bhkCount} ${pricingInput.unitType}`;
    const carpetArea = `${pricingInput.areaValue} ${pricingInput.areaUnit}`;
    const price = formatPriceWithRupee(pricingInput.price);
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { type, carpetArea, price }],
    });
    setPricingInput({
      bhkCount: '2',
      unitType: 'BHK',
      areaValue: '',
      areaUnit: 'Sq.ft',
      price: '',
    });
  };
  const [connectivityInput, setConnectivityInput] = useState({
    category: 'commute',
    name: '',
    distance: '',
    distanceUnit: 'km',
    time: '',
    timeUnit: 'min',
  });

  const addConnectivityItem = () => {
    if (!connectivityInput.name || !connectivityInput.distance || !connectivityInput.time) return;
    const newItem = {
      name: connectivityInput.name,
      distance: `${connectivityInput.distance} ${connectivityInput.distanceUnit}`,
      time: `${connectivityInput.time} ${connectivityInput.timeUnit}`,
    };
    setFormData({
      ...formData,
      connectivity: {
        ...formData.connectivity,
        [connectivityInput.category]: [
          ...(formData.connectivity[
            connectivityInput.category as keyof typeof formData.connectivity
          ] || []),
          newItem,
        ],
      },
    });
    setConnectivityInput({
      category: connectivityInput.category,
      name: '',
      distance: '',
      distanceUnit: 'km',
      time: '',
      timeUnit: 'min',
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [activePhotoTab, setActivePhotoTab] = useState(PHOTO_TABS[0]);

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white';

  const handlePropertyTypeChange = (value: string) => {
    const category = getPropertyCategoryForType(value);
    setFormData({
      ...formData,
      propertyType: value,
      propertyCategory: category,
      categoryFields:
        formData.listingFor === 'sale'
          ? getSaleCategoryDefaults(value, formData.name)
          : formData.listingFor === 'rent'
            ? getRentCategoryDefaults(value, formData.name)
            : {},
    });
  };

  const isSaleFlatApartment =
    formData.listingFor === 'sale' && formData.propertyType === 'flat-apartment';
  const isSaleHouseLike =
    formData.listingFor === 'sale' && SALE_HOUSE_LIKE_TYPES.has(formData.propertyType);
  const isSaleLandPlot =
    formData.listingFor === 'sale' &&
    (formData.propertyType === 'residential-land-plot' ||
      formData.propertyType === 'industrial-land' ||
      SALE_COMMERCIAL_LAND_LIKE_TYPES.has(formData.propertyType));
  const isSaleCommercialOfficeLike =
    formData.listingFor === 'sale' && SALE_COMMERCIAL_OFFICE_LIKE_TYPES.has(formData.propertyType);
  const isSaleCommercialShop =
    formData.listingFor === 'sale' && formData.propertyType === 'commercial-shop';
  const isSaleIndustrialBuildingLike =
    formData.listingFor === 'sale' && SALE_INDUSTRIAL_BUILDING_LIKE_TYPES.has(formData.propertyType);
  const isSaleCategoryListing =
    isSaleFlatApartment ||
    isSaleHouseLike ||
    isSaleLandPlot ||
    isSaleCommercialOfficeLike ||
    isSaleCommercialShop ||
    isSaleIndustrialBuildingLike;
  const isRentCategoryListing =
    formData.listingFor === 'rent' &&
    !!formData.propertyType &&
    formData.propertyType !== 'residential-land-plot';
  const isCategoryListing = isSaleCategoryListing || isRentCategoryListing;

  const propertyTypeOptions = getPropertyTypesForCategory(
    formData.propertyCategory,
    formData.listingFor
  );

  const updateCategoryFields = (categoryFields: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, categoryFields }));
  };

  const flatFields = isSaleFlatApartment
    ? parseFlatApartmentSaleFields(formData.categoryFields)
    : null;

  const addPhotoToCategory = (url: string) => {
    const common = mergeSaleListingCommon(formData.categoryFields);
    const current = common.photoCategories[activePhotoTab] || [];
    updateCategoryFields({
      ...formData.categoryFields,
      photoCategories: {
        ...common.photoCategories,
        [activePhotoTab]: [...current, url],
      },
    });
    setFormData((prev) => ({
      ...prev,
      images: prev.images.includes(url) ? prev.images : [...prev.images, url],
    }));
  };

  useEffect(() => {
    if (property && !property.city && property.location && cities.length > 0) {
      const matchedCity = cities.find((city) =>
        city.locations.some((loc) => loc.name === property.location)
      );
      if (matchedCity) {
        setFormData((prev) => ({ ...prev, city: matchedCity.name }));
      }
    }
  }, [property, cities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      alert('Please enter a property name');
      return;
    }
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    // Price validation
    if (isSaleCategoryListing) {
      const hasPrice =
        (isSaleFlatApartment && flatApartmentHasPrice(formData)) ||
        (isSaleHouseLike && residentialHouseHasPrice(formData)) ||
        (isSaleLandPlot &&
          (formData.propertyType === 'residential-land-plot'
            ? residentialLandPlotHasPrice(formData)
            : formData.propertyType === 'industrial-land'
              ? industrialLandHasPrice(formData)
              : commercialLandHasPrice(formData))) ||
        (isSaleCommercialOfficeLike && commercialOfficeSpaceHasPrice(formData)) ||
        (isSaleCommercialShop && commercialShopHasPrice(formData)) ||
        (isSaleIndustrialBuildingLike && industrialBuildingHasPrice(formData));
      if (!hasPrice) {
        alert('Please enter price details in the Price Details section');
        return;
      }
    } else if (isRentCategoryListing) {
      if (!rentListingHasPrice(formData.categoryFields, formData.price)) {
        alert('Please enter monthly rent in the Rent/ Lease Details section');
        return;
      }
    } else if (
      (!formData.price || formData.price <= 0) &&
      (!formData.pricing || formData.pricing.length === 0)
    ) {
      alert('Please add at least one pricing entry in the Pricing & Floor Plans section');
      return;
    }
    if (
      !isCategoryListing &&
      (!formData.price || formData.price <= 0) &&
      formData.pricing &&
      formData.pricing.length > 0
    ) {
      // Extract numeric value from first pricing entry (remove currency symbols)
      const firstPrice = formData.pricing[0].price.replace(/[₹,\s]/g, '');
      const numericPrice = parseFloat(firstPrice) || 0;
      if (numericPrice > 0) {
        formData.price = numericPrice;
      }
    }
    if (!formData.developer.trim()) {
      alert('Please select a developer');
      return;
    }
    if (!formData.city.trim()) {
      alert('Please select a city');
      return;
    }
    if (!formData.location.trim()) {
      alert('Please select a location');
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      const categorized =
        isCategoryListing &&
        Object.values(mergeSaleListingCommon(formData.categoryFields).photoCategories).flat()
          .length > 0;
      if (!categorized) {
        alert('Please add at least one photo');
        return;
      }
    }

    setSubmitting(true);

    try {
      const url = property
        ? `/api/properties/${property._id}`
        : '/api/properties';
      const method = property ? 'PUT' : 'POST';

      // Extract price from pricing array if price is not set
      let finalPrice = formData.price;
      if ((!finalPrice || finalPrice <= 0) && formData.pricing && formData.pricing.length > 0) {
        // Extract numeric value from first pricing entry
        const firstPrice = formData.pricing[0].price.replace(/[₹,\sCrLakh]/gi, '');
        const numericPrice = parseFloat(firstPrice) || 0;
        if (numericPrice > 0) {
          finalPrice = numericPrice;
        }
      }

      // Prepare data for API — merge flat-apartment fields into shared property fields
      let submitData: Record<string, unknown> = {
        ...formData,
        price: finalPrice > 0 ? parseFloat(finalPrice.toString()) : 0,
      };

      if (isSaleFlatApartment) {
        submitData = buildFlatApartmentSubmitPayload({
          ...submitData,
          categoryFields: {
            ...(submitData.categoryFields as Record<string, unknown>),
            projectSocietyName: submitData.name as string,
          },
          images: submitData.images as string[],
          pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
          price: submitData.price as number,
        }) as Record<string, unknown>;
      } else if (isSaleHouseLike) {
        const label = getPropertyTypeLabel(formData.propertyType) || 'Residential House';
        submitData = buildResidentialHouseSubmitPayload(
          {
            ...submitData,
            images: submitData.images as string[],
            pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
            price: submitData.price as number,
            categoryFields: submitData.categoryFields as Record<string, unknown>,
          },
          label
        ) as Record<string, unknown>;
      } else if (isSaleLandPlot) {
        const landPlotPayload = {
          ...submitData,
          images: submitData.images as string[],
          pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
          price: submitData.price as number,
          categoryFields: submitData.categoryFields as Record<string, unknown>,
        };
        if (formData.propertyType === 'residential-land-plot') {
          submitData = buildResidentialLandPlotSubmitPayload(landPlotPayload) as Record<string, unknown>;
        } else if (formData.propertyType === 'industrial-land') {
          submitData = buildIndustrialLandSubmitPayload(landPlotPayload) as Record<string, unknown>;
        } else if (formData.propertyType === 'warehouse-godown') {
          submitData = buildWarehouseGodownSubmitPayload(landPlotPayload) as Record<string, unknown>;
        } else {
          submitData = buildCommercialLandSubmitPayload(landPlotPayload) as Record<string, unknown>;
        }
      } else if (isSaleCommercialOfficeLike) {
        const label = getPropertyTypeLabel(formData.propertyType) || 'Commercial Office Space';
        submitData = buildCommercialOfficeSpaceSubmitPayload(
          {
            ...submitData,
            images: submitData.images as string[],
            pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
            price: submitData.price as number,
            categoryFields: submitData.categoryFields as Record<string, unknown>,
          },
          label
        ) as Record<string, unknown>;
      } else if (isSaleCommercialShop) {
        submitData = buildCommercialShopSubmitPayload({
          ...submitData,
          images: submitData.images as string[],
          pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
          price: submitData.price as number,
          categoryFields: submitData.categoryFields as Record<string, unknown>,
        }) as Record<string, unknown>;
      } else if (isSaleIndustrialBuildingLike) {
        const label = getPropertyTypeLabel(formData.propertyType) || 'Industrial Building';
        submitData = buildIndustrialBuildingLikeSubmitPayload(
          {
            ...submitData,
            images: submitData.images as string[],
            pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
            price: submitData.price as number,
            categoryFields: submitData.categoryFields as Record<string, unknown>,
          },
          label
        ) as Record<string, unknown>;
      } else if (isRentCategoryListing) {
        submitData = buildRentSubmitPayload({
          ...submitData,
          images: submitData.images as string[],
          pricing: submitData.pricing as Array<{ type: string; carpetArea: string; price: string }>,
          price: submitData.price as number,
          categoryFields: submitData.categoryFields as Record<string, unknown>,
          propertyType: submitData.propertyType as string | undefined,
        }) as Record<string, unknown>;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.message || error.error || 'Failed to save property';
        console.error('API Error:', error);
        throw new Error(errorMessage);
      }

      alert(property ? 'Property updated successfully!' : 'Property created successfully!');
      // Small delay to ensure database is updated
      setTimeout(() => {
        onSuccess();
      }, 100);
    } catch (error: any) {
      console.error('Error saving property:', error);
      alert(error.message || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Unified listing header */}
          <div className="space-y-6 border-b border-gray-200 pb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">For</p>
                <div className="flex flex-wrap gap-6">
                  {LISTING_FOR_OPTIONS.map((option) => (
                    <label key={option.value} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="listingFor"
                        value={option.value}
                        checked={formData.listingFor === option.value}
                        onChange={(e) => {
                          const listingFor = e.target.value as ListingFor;
                          let propertyType = formData.propertyType;
                          let propertyCategory = formData.propertyCategory;
                          let categoryFields = formData.categoryFields;

                          if (listingFor === 'rent' && propertyType === 'residential-land-plot') {
                            propertyType = '';
                            categoryFields = {};
                          } else if (listingFor === 'rent' && propertyType) {
                            categoryFields = getRentCategoryDefaults(propertyType, formData.name);
                          } else if (listingFor === 'sale' && propertyType) {
                            categoryFields = getSaleCategoryDefaults(propertyType, formData.name);
                          }

                          setFormData({
                            ...formData,
                            listingFor,
                            propertyType,
                            propertyCategory,
                            categoryFields,
                          });
                        }}
                        className="h-4 w-4 border-gray-300 text-brand-red focus:ring-brand-red"
                      />
                      <span className="text-sm text-gray-800">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <SegmentButtonGroup
                  label="Category"
                  options={['Residential', 'Commercial']}
                  value={
                    formData.propertyCategory === 'residential'
                      ? 'Residential'
                      : formData.propertyCategory === 'commercial'
                        ? 'Commercial'
                        : ''
                  }
                  onChange={(label) => {
                    const propertyCategory = (label === 'Commercial' ? 'commercial' : 'residential') as PropertyCategory;
                    setFormData({
                      ...formData,
                      propertyCategory,
                      propertyType: '',
                      categoryFields: {},
                    });
                  }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  disabled={!formData.propertyCategory}
                  className={`${inputClass}${!formData.propertyCategory ? ' opacity-60 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {formData.propertyCategory ? 'Select Property Type' : 'Select category first'}
                  </option>
                  {propertyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!formData.propertyType && (
              <p className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg px-4 py-3">
                Select a property type above to continue with location, pricing, photos, and other details.
              </p>
            )}

            {formData.propertyType && (
              <>
              {isSaleFlatApartment && flatFields && (
                <SegmentButtonGroup
                  label="Total No. of Flats in Your Society"
                  options={[...SOCIETY_FLATS_OPTIONS]}
                  value={String(flatFields.societyFlatsCount || '')}
                  onChange={(value) =>
                    updateCategoryFields({ ...formData.categoryFields, societyFlatsCount: value })
                  }
                />
              )}

            {/* Single location block — uses existing city, name, location fields */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value, location: '' })
                    }
                    className={inputClass}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                    {property?.city && !cities.some((city) => city.name === property.city) && (
                      <option value={property.city}>{property.city}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isSaleFlatApartment ? 'Name of Project/Society *' : 'Property Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    placeholder={
                      isSaleFlatApartment ? 'Name Of Project/Society' : 'Property / Project name'
                    }
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        name,
                        ...(isCategoryListing
                          ? {
                              categoryFields: {
                                ...prev.categoryFields,
                                projectSocietyName: name,
                              },
                            }
                          : {}),
                      }));
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isSaleFlatApartment ? 'Locality / Area *' : 'Location *'}
                  </label>
                  <select
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!formData.city}
                    className={`${inputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  >
                    <option value="">
                      {formData.city ? 'Select Location' : 'Select city first'}
                    </option>
                    {cities
                      .find((city) => city.name === formData.city)
                      ?.locations.map((loc) => (
                        <option key={loc._id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    {property?.location &&
                      formData.city &&
                      !cities
                        .find((city) => city.name === formData.city)
                        ?.locations.some((loc) => loc.name === property.location) && (
                        <option value={property.location}>{property.location}</option>
                      )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Developer *</label>
                  <select
                    required
                    value={formData.developer}
                    onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select Developer</option>
                    {developers.map((dev) => (
                      <option key={dev._id} value={dev.name}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <PropertyCategoryFields
              listingFor={formData.listingFor}
              propertyType={formData.propertyType}
              categoryFields={formData.categoryFields}
              onChange={updateCategoryFields}
              underlineInputClass={inputClass}
            />
              </>
            )}
          </div>

          {formData.propertyType && (
          <>

          {/* Display Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select where this property should be displayed on the homepage. Leave empty to only show in search/developer pages.
            </p>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showInTopSelling}
                  onChange={(e) => setFormData({ ...formData, showInTopSelling: e.target.checked })}
                  className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">Show in Top Selling Projects</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showInPremium}
                  onChange={(e) => setFormData({ ...formData, showInPremium: e.target.checked })}
                  className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">Show in Premium Projects</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.showInNewlyLaunched}
                  onChange={(e) => setFormData({ ...formData, showInNewlyLaunched: e.target.checked })}
                  className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">Show in Newly Launched Projects</span>
              </label>
            </div>
          </div>

          {/* Highlights Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Highlights (Bullet Points)</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter highlight point (e.g., Well-appointed 3 BHK apartments)"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (highlightInput.trim()) {
                        setFormData({
                          ...formData,
                          highlights: [...formData.highlights, highlightInput.trim()],
                        });
                        setHighlightInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (highlightInput.trim()) {
                      setFormData({
                        ...formData,
                        highlights: [...formData.highlights, highlightInput.trim()],
                      });
                      setHighlightInput('');
                    }
                  }}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal-dark transition"
                >
                  Add
                </button>
              </div>
              {formData.highlights.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">• {highlight}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            highlights: formData.highlights.filter((_, i) => i !== index),
                          });
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Overview Section — project listings; flat sale uses category fields instead */}
          {!isCategoryListing && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Storeys</label>
                <input
                  type="text"
                  placeholder="e.g., G + 39 Storeys"
                  value={formData.storeys}
                  onChange={(e) => setFormData({ ...formData, storeys: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Area</label>
                <input
                  type="text"
                  placeholder="e.g., 5.5 Acres"
                  value={formData.projectArea}
                  onChange={(e) => setFormData({ ...formData, projectArea: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Possession Status</label>
                <input
                  type="text"
                  placeholder="e.g., Ready to Move / Under Construction"
                  value={formData.possessionStatus}
                  onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Possession Date</label>
                <input
                  type="text"
                  placeholder="e.g., 12-2028"
                  value={formData.possessionDate}
                  onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advertiser RERA Number</label>
                <input
                  type="text"
                  placeholder="e.g., A52000000045"
                  value={formData.advertiserReraNumber}
                  onChange={(e) => setFormData({ ...formData, advertiserReraNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project RERA Number</label>
                <input
                  type="text"
                  placeholder="e.g., P51900046369"
                  value={formData.projectReraNumber}
                  onChange={(e) => setFormData({ ...formData, projectReraNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">RERA QR Code Image</label>
                  {uploadingQr && <span className="text-xs text-brand-teal animate-pulse">Uploading...</span>}
                </div>
                <div className="space-y-3">
                  {/* File Upload for QR */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size too large. Maximum size is 5MB.');
                        return;
                      }

                      setUploadingQr(true);
                      try {
                        const uploadData = new FormData();
                        uploadData.append('file', file);

                        const response = await fetch('/api/upload/image', {
                          method: 'POST',
                          body: uploadData,
                        });

                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(error.error || 'Failed to upload QR code');
                        }

                        const data = await response.json();
                        setFormData({ ...formData, reraQrCode: data.url });
                      } catch (error: any) {
                        console.error('Error uploading QR code:', error);
                        alert(error.message || 'Failed to upload QR code');
                      } finally {
                        setUploadingQr(false);
                      }
                    }}
                    disabled={uploadingQr}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:opacity-50"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">OR</span>
                    <input
                      type="text"
                      placeholder="Enter QR Code Image URL"
                      value={formData.reraQrCode}
                      onChange={(e) => setFormData({ ...formData, reraQrCode: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  {formData.reraQrCode && (
                    <div className="mt-2 w-32 h-32 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-2 bg-gray-50 shadow-inner group relative">
                      <img src={formData.reraQrCode} alt="RERA QR Preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, reraQrCode: '' })}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <textarea
                  rows={2}
                  placeholder="Complete property address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
          )}

          {/* Pricing Section — project BHK configs; flat sale uses Price Details above */}
          {!isCategoryListing && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing & Floor Plans</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add each configuration (BHK or RK) with carpet area and price. At least one entry is required.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Configuration</label>
                  <div className="flex gap-2">
                    <select
                      value={pricingInput.bhkCount}
                      onChange={(e) => setPricingInput({ ...pricingInput, bhkCount: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white text-sm"
                    >
                      {['1', '2', '3', '4', '5', '6'].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <select
                      value={pricingInput.unitType}
                      onChange={(e) => setPricingInput({ ...pricingInput, unitType: e.target.value as 'BHK' | 'RK' })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white text-sm font-semibold"
                    >
                      <option value="BHK">BHK</option>
                      <option value="RK">RK</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Carpet Area</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Area"
                      value={pricingInput.areaValue}
                      onChange={(e) => setPricingInput({ ...pricingInput, areaValue: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white text-sm"
                    />
                    <select
                      value={pricingInput.areaUnit}
                      onChange={(e) => setPricingInput({ ...pricingInput, areaUnit: e.target.value as 'Sq.ft' | 'Sq.m' })}
                      className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white text-sm"
                    >
                      <option value="Sq.ft">Sq.ft</option>
                      <option value="Sq.m">Sq.m</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="text"
                      placeholder="2.75 Cr or 75 Lakh"
                      value={pricingInput.price}
                      onChange={(e) => setPricingInput({ ...pricingInput, price: e.target.value.replace(/[₹\s]/g, '') })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addPricingEntry}
                    className="w-full px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal-dark transition font-semibold text-sm"
                  >
                    + Add Plan
                  </button>
                </div>
              </div>
              {formData.pricing.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.pricing.map((price, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-700">
                        {price.type} - {price.carpetArea} - {price.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            pricing: formData.pricing.filter((_, i) => i !== index),
                          });
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Amenities & Facilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Facilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EXTERNAL_AMENITIES.map((amenity) => (
                      <label key={amenity.name} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                amenities: [...formData.amenities, amenity.name],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                amenities: formData.amenities.filter((a) => a !== amenity.name),
                              });
                            }
                          }}
                          className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                        />
                        <span className="text-sm text-gray-700">{amenity.icon} {amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.amenities.length} amenities
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facilities (Internal)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter facility (e.g., Lift)"
                      value={facilityInput}
                      onChange={(e) => setFacilityInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (facilityInput.trim()) {
                            setFormData({
                              ...formData,
                              facilities: [...formData.facilities, facilityInput.trim()],
                            });
                            setFacilityInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (facilityInput.trim()) {
                          setFormData({
                            ...formData,
                            facilities: [...formData.facilities, facilityInput.trim()],
                          });
                          setFacilityInput('');
                        }
                      }}
                      className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal-dark transition"
                    >
                      Add
                    </button>
                  </div>
                  {formData.facilities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {formData.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center bg-gray-50 px-3 py-1 rounded">
                          <span className="text-sm text-gray-700">{facility}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                facilities: formData.facilities.filter((_, i) => i !== index),
                              });
                            }}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications — not applicable for vacant land/plot listings */}
          {!isSaleLandPlot && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
            <p className="text-sm text-gray-500 mb-4">Select standard Indian market specifications from the dropdowns below.</p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Structure Quality</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Structure Type</label>
                    <select
                      value={formData.specifications.structureQuality || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          structureQuality: e.target.value,
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select structure quality</option>
                      {STRUCTURE_QUALITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Floor</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Living & Dining Flooring</label>
                    <select
                      value={formData.specifications.floor?.['livingDining'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          floor: { ...formData.specifications.floor, livingDining: e.target.value },
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select flooring</option>
                      {LIVING_DINING_FLOORING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bathroom/Utility Area</label>
                    <select
                      value={formData.specifications.floor?.['bathroomUtility'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          floor: { ...formData.specifications.floor, bathroomUtility: e.target.value },
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select flooring</option>
                      {BATHROOM_FLOORING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Kitchen</label>
                    <select
                      value={formData.specifications.floor?.['kitchen'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          floor: { ...formData.specifications.floor, kitchen: e.target.value },
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select flooring</option>
                      {KITCHEN_FLOORING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fitting</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bathroom</label>
                    <select
                      value={formData.specifications.fitting?.['bathroom'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          fitting: { ...formData.specifications.fitting, bathroom: e.target.value },
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select fittings</option>
                      {BATHROOM_FITTING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Door</label>
                    <select
                      value={formData.specifications.fitting?.['door'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          fitting: { ...formData.specifications.fitting, door: e.target.value },
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select door type</option>
                      {DOOR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Windows</label>
                    <select
                      value={formData.specifications.fitting?.['windows'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          fitting: { ...formData.specifications.fitting, windows: e.target.value },
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="">Select window type</option>
                      {WINDOW_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Connectivity Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connectivity</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-2">
                <div className="w-full sm:w-auto sm:min-w-[130px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select
                    value={connectivityInput.category}
                    onChange={(e) => setConnectivityInput({ ...connectivityInput, category: e.target.value })}
                    className="w-full text-sm px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="commute">Commute</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="essentials">Essentials</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Bus Station"
                    value={connectivityInput.name}
                    onChange={(e) => setConnectivityInput({ ...connectivityInput, name: e.target.value })}
                    className="w-full text-sm px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
                <div className="w-full sm:flex-1 sm:min-w-[160px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Distance</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="1.7"
                      value={connectivityInput.distance}
                      onChange={(e) =>
                        handleNumericInputChange(e.target.value, (distance) =>
                          setConnectivityInput({ ...connectivityInput, distance })
                        )
                      }
                      className="flex-1 min-w-0 text-sm px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    />
                    <select
                      value={connectivityInput.distanceUnit}
                      onChange={(e) =>
                        setConnectivityInput({ ...connectivityInput, distanceUnit: e.target.value })
                      }
                      className="w-16 text-sm px-1.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="km">km</option>
                      <option value="m">m</option>
                      <option value="mi">mi</option>
                    </select>
                  </div>
                </div>
                <div className="w-full sm:flex-1 sm:min-w-[140px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="7"
                      value={connectivityInput.time}
                      onChange={(e) =>
                        handleNumericInputChange(e.target.value, (time) =>
                          setConnectivityInput({ ...connectivityInput, time })
                        )
                      }
                      className="flex-1 min-w-0 text-sm px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addConnectivityItem();
                        }
                      }}
                    />
                    <select
                      value={connectivityInput.timeUnit}
                      onChange={(e) =>
                        setConnectivityInput({ ...connectivityInput, timeUnit: e.target.value })
                      }
                      className="w-16 text-sm px-1.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                    >
                      <option value="min">min</option>
                      <option value="hr">hr</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Add connectivity item"
                  title="Add"
                  onClick={addConnectivityItem}
                  className="shrink-0 self-end sm:mb-0 mb-1 flex h-9 w-9 sm:h-[34px] sm:w-[34px] items-center justify-center rounded-md bg-brand-teal text-white text-lg font-bold hover:bg-brand-teal-dark transition focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2"
                >
                  +
                </button>
              </div>
              {Object.entries(formData.connectivity).map(([category, items]) => (
                items && items.length > 0 && (
                  <div key={category} className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">
                            {item.name}: {item.distance} | {item.time}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                connectivity: {
                                  ...formData.connectivity,
                                  [category]: items.filter((_, i) => i !== index),
                                },
                              });
                            }}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Property Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Status</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                />
                <span className="ml-2 text-sm text-gray-700 font-medium">Available</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">
                Uncheck this if the property is currently not available for sale/rent
              </p>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos *</h3>
            {isCategoryListing && (
              <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-4">
                {PHOTO_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActivePhotoTab(tab)}
                    className={`px-3 py-2 text-xs sm:text-sm whitespace-nowrap border-b-2 transition ${
                      activePhotoTab === tab
                        ? 'border-brand-red text-brand-red font-medium'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-600 mb-3">
              {isCategoryListing
                ? `Upload photos for "${activePhotoTab}". All photos are saved to the property gallery.`
                : 'Add multiple images — upload one at a time or pick several files. The first image is the main cover photo.'}
            </p>
            <div className="space-y-2">
              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image File
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    setUploadingImage(true);
                    const newUrls: string[] = [];

                    try {
                      for (const file of Array.from(files)) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert(`${file.name} is too large. Maximum size is 10MB.`);
                          continue;
                        }

                        const uploadData = new FormData();
                        uploadData.append('file', file);

                        const response = await fetch('/api/upload/image', {
                          method: 'POST',
                          body: uploadData,
                        });

                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(error.error || `Failed to upload ${file.name}`);
                        }

                        const data = await response.json();
                        newUrls.push(data.url);
                      }

                      if (newUrls.length > 0) {
                        if (isCategoryListing) {
                          newUrls.forEach((url) => addPhotoToCategory(url));
                        } else {
                          setFormData({
                            ...formData,
                            images: [...formData.images, ...newUrls],
                          });
                        }
                      }
                      e.target.value = '';
                    } catch (error: unknown) {
                      console.error('Error uploading image:', error);
                      alert(error instanceof Error ? error.message : 'Failed to upload image');
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploadingImage && (
                  <p className="text-xs text-brand-teal mt-1">Uploading image to Cloudinary...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, WebP, GIF (Max 10MB each). Select multiple files at once.
                </p>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter Image URL"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (imageInput.trim()) {
                        if (isCategoryListing) {
                          addPhotoToCategory(imageInput.trim());
                        } else {
                          setFormData({
                            ...formData,
                            images: [...formData.images, imageInput.trim()],
                          });
                        }
                        setImageInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (imageInput.trim()) {
                      if (isCategoryListing) {
                        addPhotoToCategory(imageInput.trim());
                      } else {
                        setFormData({
                          ...formData,
                          images: [...formData.images, imageInput.trim()],
                        });
                      }
                      setImageInput('');
                    }
                  }}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal-dark transition"
                >
                  Add URL
                </button>
              </div>
              <p className="text-xs text-gray-500">Press Enter to add image URL</p>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      {index === 0 && (
                        <span className="absolute top-1 left-1 z-10 bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <img
                        src={img}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Videos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos (Optional)</h3>
            <p className="text-sm text-gray-600 mb-3">
              Add property walkthrough or promo videos. Visitors can switch between photos and videos on the details page.
            </p>
            <div className="space-y-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video File
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    setUploadingVideo(true);
                    const newUrls: string[] = [];

                    try {
                      for (const file of Array.from(files)) {
                        if (file.size > 100 * 1024 * 1024) {
                          alert(`${file.name} is too large. Maximum size is 100MB.`);
                          continue;
                        }

                        const uploadData = new FormData();
                        uploadData.append('file', file);

                        const response = await fetch('/api/upload/video', {
                          method: 'POST',
                          body: uploadData,
                        });

                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(error.error || `Failed to upload ${file.name}`);
                        }

                        const data = await response.json();
                        newUrls.push(data.url);
                      }

                      if (newUrls.length > 0) {
                        setFormData({
                          ...formData,
                          videos: [...formData.videos, ...newUrls],
                        });
                      }
                      e.target.value = '';
                    } catch (error: unknown) {
                      console.error('Error uploading video:', error);
                      alert(error instanceof Error ? error.message : 'Failed to upload video');
                    } finally {
                      setUploadingVideo(false);
                    }
                  }}
                  disabled={uploadingVideo}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploadingVideo && (
                  <p className="text-xs text-brand-teal mt-1">Uploading video to Cloudinary...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: MP4, WebM, MOV, AVI (Max 100MB each)
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter Video URL"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (videoInput.trim()) {
                        setFormData({
                          ...formData,
                          videos: [...formData.videos, videoInput.trim()],
                        });
                        setVideoInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (videoInput.trim()) {
                      setFormData({
                        ...formData,
                        videos: [...formData.videos, videoInput.trim()],
                      });
                      setVideoInput('');
                    }
                  }}
                  className="px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal-dark transition"
                >
                  Add URL
                </button>
              </div>

              {formData.videos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200 bg-black">
                      <video src={video} className="w-full h-28 object-cover" controls preload="metadata" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            videos: formData.videos.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          </>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            {formData.propertyType && (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-brand-red text-white rounded-lg font-semibold hover:bg-brand-red-dark transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : property ? 'Update Property' : 'Add Property'}
              </button>
            )}
          </div>
        </form>
      </div >
    </div >
  );
}

