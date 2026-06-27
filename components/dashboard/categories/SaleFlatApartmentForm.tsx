'use client';

import { useState } from 'react';
import SegmentButtonGroup from '@/components/dashboard/form/SegmentButtonGroup';
import {
  AGE_OF_CONSTRUCTION_OPTIONS,
  BROKERAGE_OPTIONS,
  FLOOR_NO_OPTIONS,
  FURNISHED_OPTIONS,
  getMonthOptions,
  getNumericOptions,
  getYearOptions,
  MAINTENANCE_FREQUENCY_OPTIONS,
  parseFlatApartmentSaleFields,
  PHOTO_TABS,
  SOCIETY_FLATS_OPTIONS,
  syncBedroomSizes,
  bedroomCountFromValue,
  type FlatApartmentSaleFields,
} from '@/lib/flat-apartment-sale-fields';

interface SaleFlatApartmentFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
  hidePhotos?: boolean;
  hideSocietyFlats?: boolean;
  hideSaleSections?: boolean;
}

export default function SaleFlatApartmentForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
  hidePhotos = false,
  hideSocietyFlats = false,
  hideSaleSections = false,
}: SaleFlatApartmentFormProps) {
  const fields = parseFlatApartmentSaleFields(rawFields);
  const [activePhotoTab, setActivePhotoTab] = useState(PHOTO_TABS[0]);
  const [photoInput, setPhotoInput] = useState('');

  const update = (patch: Partial<FlatApartmentSaleFields>) => {
    onChange({ ...fields, ...patch });
  };

  const handleBedroomsChange = (value: string) => {
    const count = bedroomCountFromValue(value);
    update({
      bedrooms: value,
      bedroomSizes: syncBedroomSizes(count, fields.bedroomSizes),
    });
  };

  const bedroomPlusOptions = getNumericOptions(10, '5').slice(5);

  const addPhoto = () => {
    if (!photoInput.trim()) return;
    const current = fields.photoCategories[activePhotoTab] || [];
    update({
      photoCategories: {
        ...fields.photoCategories,
        [activePhotoTab]: [...current, photoInput.trim()],
      },
    });
    setPhotoInput('');
  };

  const removePhoto = (tab: string, index: number) => {
    const current = fields.photoCategories[tab] || [];
    update({
      photoCategories: {
        ...fields.photoCategories,
        [tab]: current.filter((_, i) => i !== index),
      },
    });
  };

  const areaUnitSelect = (value: string, onUnitChange: (unit: string) => void) => (
    <select
      value={value}
      onChange={(e) => onUnitChange(e.target.value)}
      className="border-0 border-l border-gray-300 bg-transparent text-sm text-gray-700 pl-2 pr-1 focus:ring-0"
    >
      <option value="Sq-ft">Sq-ft</option>
      <option value="Sq-m">Sq-m</option>
    </select>
  );

  return (
    <div className="space-y-8">
      {hideSocietyFlats ? null : (
        <SegmentButtonGroup
          label="Total No. of Flats in Your Society"
          options={[...SOCIETY_FLATS_OPTIONS]}
          value={fields.societyFlatsCount}
          onChange={(value) => update({ societyFlatsCount: value as FlatApartmentSaleFields['societyFlatsCount'] })}
        />
      )}

      {/* Property Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
        <div className="space-y-5">
          <SegmentButtonGroup
            label="Bedrooms"
            options={['1', '2', '3', '4', '5+']}
            value={fields.bedrooms}
            onChange={handleBedroomsChange}
            plusOptions={bedroomPlusOptions}
            plusValue={fields.bedrooms.endsWith('+') || parseInt(fields.bedrooms, 10) > 5 ? fields.bedrooms : ''}
            onPlusChange={handleBedroomsChange}
          />

          {fields.bedroomSizes.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-sm text-gray-700">
                Specify bedroom sizes — For example: 12 x 10 ft
              </div>
              <div className="p-4 space-y-3">
                {fields.bedroomSizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-[100px_1fr_auto_1fr_auto] gap-2 items-center text-sm">
                    <span className="text-gray-600">Bedroom {index + 1}</span>
                    <input
                      type="text"
                      placeholder="Length"
                      value={size.length}
                      onChange={(e) => {
                        const next = [...fields.bedroomSizes];
                        next[index] = { ...next[index], length: e.target.value };
                        update({ bedroomSizes: next });
                      }}
                      className="border border-gray-300 rounded px-2 py-1.5 text-gray-900"
                    />
                    <span className="text-gray-400 text-center">×</span>
                    <input
                      type="text"
                      placeholder="Breadth"
                      value={size.breadth}
                      onChange={(e) => {
                        const next = [...fields.bedroomSizes];
                        next[index] = { ...next[index], breadth: e.target.value };
                        update({ bedroomSizes: next });
                      }}
                      className="border border-gray-300 rounded px-2 py-1.5 text-gray-900"
                    />
                    <span className="text-gray-500">ft</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SegmentButtonGroup
            label="Balconies"
            options={['0', '1', '2', '3', '3+']}
            value={fields.balconies}
            onChange={(value) => update({ balconies: value })}
            plusOptions={['4', '5', '6', '7', '8']}
            plusValue={parseInt(fields.balconies, 10) > 3 ? fields.balconies : ''}
            onPlusChange={(value) => update({ balconies: value })}
          />

          <SegmentButtonGroup
            label="Floor No."
            options={[...FLOOR_NO_OPTIONS, '5+']}
            value={fields.floorNo}
            onChange={(value) => update({ floorNo: value })}
            plusOptions={getNumericOptions(20).slice(5)}
            plusValue={parseInt(fields.floorNo, 10) > 5 ? fields.floorNo : ''}
            onPlusChange={(value) => update({ floorNo: value })}
          />

          <SegmentButtonGroup
            label="Total Floors"
            options={[...getNumericOptions(13), '13+']}
            value={fields.totalFloors}
            onChange={(value) => update({ totalFloors: value })}
            plusOptions={getNumericOptions(30).slice(13)}
            plusValue={parseInt(fields.totalFloors, 10) > 13 ? fields.totalFloors : ''}
            onPlusChange={(value) => update({ totalFloors: value })}
          />

          <SegmentButtonGroup
            label="Furnished Status"
            options={FURNISHED_OPTIONS.map((o) => o.label)}
            value={FURNISHED_OPTIONS.find((o) => o.value === fields.furnishedStatus)?.label || ''}
            onChange={(label) => {
              const match = FURNISHED_OPTIONS.find((o) => o.label === label);
              update({ furnishedStatus: match?.value || '' });
            }}
          />

          <SegmentButtonGroup
            label="Bathrooms"
            options={['1', '2', '3', '3+']}
            value={fields.bathrooms}
            onChange={(value) => update({ bathrooms: value })}
            plusOptions={['4', '5', '6']}
            plusValue={parseInt(fields.bathrooms, 10) > 3 ? fields.bathrooms : ''}
            onPlusChange={(value) => update({ bathrooms: value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floors Allowed for construction
            </label>
            <select
              value={fields.floorsAllowedConstruction}
              onChange={(e) => update({ floorsAllowedConstruction: e.target.value })}
              className={underlineInputClass}
            >
              <option value="">Total Floor</option>
              {getNumericOptions(50).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Area */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Super Area</label>
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                placeholder="Super Area"
                value={fields.superArea}
                onChange={(e) => update({ superArea: e.target.value })}
                className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
              />
              {areaUnitSelect(fields.superAreaUnit, (unit) => update({ superAreaUnit: unit }))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => update({ showBuiltUpArea: !fields.showBuiltUpArea })}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center border border-gray-400 rounded text-xs">
              {fields.showBuiltUpArea ? '−' : '+'}
            </span>
            Built Up Area
          </button>
          {fields.showBuiltUpArea && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Built Up Area</label>
              <div className="flex items-center border-b border-gray-300">
                <input
                  type="text"
                  placeholder="Built Up Area"
                  value={fields.builtUpArea}
                  onChange={(e) => update({ builtUpArea: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
                />
                {areaUnitSelect(fields.builtUpAreaUnit, (unit) => update({ builtUpAreaUnit: unit }))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area</label>
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                placeholder="Carpet Area"
                value={fields.carpetArea}
                onChange={(e) => update({ carpetArea: e.target.value })}
                className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
              />
              {areaUnitSelect(fields.carpetAreaUnit, (unit) => update({ carpetAreaUnit: unit }))}
            </div>
          </div>
        </div>
      </div>

      {!hideSaleSections && (
      <>
      {/* Transaction & Availability */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Type, Property Availability</h3>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Transaction Type</p>
            <div className="flex flex-wrap gap-6">
              {[
                { value: 'new', label: 'New Property' },
                { value: 'resale', label: 'Resale' },
              ].map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transactionType"
                    checked={fields.transactionType === opt.value}
                    onChange={() => update({ transactionType: opt.value as FlatApartmentSaleFields['transactionType'] })}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Possession Status</p>
            <div className="flex flex-wrap gap-6">
              {[
                { value: 'under-construction', label: 'Under Construction' },
                { value: 'ready-to-move', label: 'Ready to Move' },
              ].map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="possessionStatus"
                    checked={fields.possessionStatus === opt.value}
                    onChange={() => update({ possessionStatus: opt.value as FlatApartmentSaleFields['possessionStatus'] })}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {fields.possessionStatus === 'under-construction' && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Available From</p>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={fields.availableFromMonth}
                  onChange={(e) => update({ availableFromMonth: e.target.value })}
                  className={underlineInputClass}
                >
                  <option value="">Month</option>
                  {getMonthOptions().map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={fields.availableFromYear}
                  onChange={(e) => update({ availableFromYear: e.target.value })}
                  className={underlineInputClass}
                >
                  <option value="">Year</option>
                  {getYearOptions().map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {fields.possessionStatus === 'ready-to-move' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age of Construction</label>
              <select
                value={fields.ageOfConstruction}
                onChange={(e) => update({ ageOfConstruction: e.target.value })}
                className={underlineInputClass}
              >
                <option value="">Select</option>
                {AGE_OF_CONSTRUCTION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Price Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>

        {fields.transactionType === 'new' && fields.possessionStatus === 'under-construction' && (
          <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
            If Super Area is entered, all price calculations will be done on the Super Area. If Only Carpet Area is
            entered, all price calculations will be done on the Carpet Area.
          </div>
        )}

        {fields.transactionType === 'new' ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Basic Price</span>
                <span className="text-gray-500">Per Sqft</span>
              </div>
              <div className="flex items-center border-b border-gray-300">
                <span className="text-gray-500 pr-2">₹</span>
                <input
                  type="text"
                  placeholder="Enter Basic Price"
                  value={fields.basicPricePerSqft}
                  onChange={(e) => update({ basicPricePerSqft: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Floor PLC</span>
                <span className="text-gray-500">Per Sqft</span>
              </div>
              <div className="flex items-center border-b border-gray-300">
                <span className="text-gray-500 pr-2">₹</span>
                <input
                  type="text"
                  placeholder="Enter Floor PLC"
                  value={fields.floorPlcPerSqft}
                  onChange={(e) => update({ floorPlcPerSqft: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Price</label>
                <input
                  type="text"
                  placeholder="Enter Total Price"
                  value={fields.expectedPrice}
                  onChange={(e) => update({ expectedPrice: e.target.value })}
                  className={underlineInputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Sq-ft</label>
                <div className="flex items-center border-b border-gray-300">
                  <span className="text-gray-500 pr-2">₹</span>
                  <input
                    type="text"
                    value={fields.pricePerSqft}
                    onChange={(e) => update({ pricePerSqft: e.target.value })}
                    className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Price Includes</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'priceIncludesPlc', label: 'PLC' },
                  { key: 'priceIncludesCarParking', label: 'Car Parking' },
                  { key: 'priceIncludesClubMembership', label: 'Club Membership' },
                ].map(({ key, label }) => (
                  <label key={key} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fields[key as keyof FlatApartmentSaleFields] as boolean}
                      onChange={(e) => update({ [key]: e.target.checked })}
                      className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    />
                    <span className="text-sm text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fields.stampDutyExcluded}
                onChange={(e) => update({ stampDutyExcluded: e.target.checked })}
                className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
              />
              <span className="text-sm text-gray-800">Stamp Duty & Registration charges excluded.</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking/Token Amount</label>
              <div className="flex items-center border-b border-gray-300">
                <span className="text-gray-500 pr-2">₹</span>
                <input
                  type="text"
                  placeholder="Booking/Token Amount"
                  value={fields.bookingTokenAmount}
                  onChange={(e) => update({ bookingTokenAmount: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Charges</label>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center border-b border-gray-300">
                  <span className="text-gray-500 pr-2">₹</span>
                  <input
                    type="text"
                    placeholder="Maintenance Charges"
                    value={fields.maintenanceCharges}
                    onChange={(e) => update({ maintenanceCharges: e.target.value })}
                    className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                  />
                </div>
                <span className="text-sm text-gray-500">per</span>
                <select
                  value={fields.maintenanceFrequency}
                  onChange={(e) => update({ maintenanceFrequency: e.target.value })}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1.5 text-gray-900 bg-white"
                >
                  {MAINTENANCE_FREQUENCY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brokerage (Brokers only)</label>
              <select
                value={fields.brokerage}
                onChange={(e) => update({ brokerage: e.target.value })}
                className={underlineInputClass}
              >
                <option value="">Select Brokerage</option>
                {BROKERAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* Categorized Photos */}
      {!hidePhotos && (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
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

        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center mb-4">
          <p className="text-sm text-gray-700 mb-1">
            85% of <span className="text-brand-red font-semibold">Buyers</span> enquire on Properties with Photos
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Upload Photos & Get upto <span className="text-brand-red font-semibold">10X more Enquiries</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
              placeholder="Paste image URL for this category"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
            />
            <button
              type="button"
              onClick={addPhoto}
              className="px-4 py-2 border border-brand-red text-brand-red rounded-lg text-sm font-medium hover:bg-red-50"
            >
              Add Photos Now
            </button>
          </div>
        </div>

        {(fields.photoCategories[activePhotoTab] || []).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(fields.photoCategories[activePhotoTab] || []).map((url, index) => (
              <div key={`${url}-${index}`} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img src={url} alt={`${activePhotoTab} ${index + 1}`} className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(activePhotoTab, index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
