'use client';

import {
  BROKERAGE_OPTIONS,
  MAINTENANCE_FREQUENCY_OPTIONS,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import {
  BUSINESS_SECTOR_OPTIONS,
  IN_BUSINESS_SINCE_OPTIONS,
  LAND_ZONE_OPTIONS,
  type OfficeFurnishedStatus,
  type PantryType,
  type YesNo,
} from '@/lib/commercial-office-space-sale-fields';
import { SaleTransactionSection } from '@/components/dashboard/categories/SaleListingSharedSections';
import SegmentButtonGroup from '@/components/dashboard/form/SegmentButtonGroup';
import MeasuredInput from '@/components/dashboard/form/MeasuredInput';
import { BUILDING_AREA_UNIT_OPTIONS } from '@/lib/dashboard-measurements';

export const FURNISHED_OPTIONS: { value: OfficeFurnishedStatus; label: string }[] = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

export function YesNoGroup({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-6">
        {[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ].map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === opt.value}
              onChange={() => onChange(opt.value as YesNo)}
              className="h-4 w-4 text-brand-red focus:ring-brand-red"
            />
            <span className="text-sm text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function PantryCafeteriaGroup({
  name,
  value,
  onChange,
}: {
  name: string;
  value: PantryType;
  onChange: (value: PantryType) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Pantry/Cafeteria</p>
      <div className="flex flex-wrap gap-6">
        {[
          { value: 'dry', label: 'Dry' },
          { value: 'wet', label: 'Wet' },
          { value: 'not-available', label: 'Not Available' },
        ].map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={value === opt.value}
              onChange={() => onChange(opt.value as PantryType)}
              className="h-4 w-4 text-brand-red focus:ring-brand-red"
            />
            <span className="text-sm text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FurnishedStatusGroup({
  value,
  onChange,
}: {
  value: OfficeFurnishedStatus;
  onChange: (value: OfficeFurnishedStatus) => void;
}) {
  return (
    <SegmentButtonGroup
      label="Furnished Status"
      options={FURNISHED_OPTIONS.map((o) => o.label)}
      value={FURNISHED_OPTIONS.find((o) => o.value === value)?.label || ''}
      onChange={(label) => {
        const match = FURNISHED_OPTIONS.find((o) => o.label === label);
        onChange(match?.value || '');
      }}
    />
  );
}

type LocationFields = { landZone: string; idealForBusinesses: string };

export function CommercialPropertyLocationSection({
  fields,
  update,
  underlineInputClass,
}: {
  fields: LocationFields;
  update: (patch: Partial<LocationFields>) => void;
  underlineInputClass: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Land Zone</label>
          <select
            value={fields.landZone}
            onChange={(e) => update({ landZone: e.target.value })}
            className={underlineInputClass}
          >
            <option value="">Select Land Zone</option>
            {LAND_ZONE_OPTIONS.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ideal For Businesses</label>
          <input
            type="text"
            placeholder="Please Enter Text"
            value={fields.idealForBusinesses}
            onChange={(e) => update({ idealForBusinesses: e.target.value })}
            className={underlineInputClass}
          />
        </div>
      </div>
    </div>
  );
}

type AreaFields = {
  superArea: string;
  superAreaUnit: string;
  builtUpArea: string;
  builtUpAreaUnit: string;
  showBuiltUpArea: boolean;
  carpetArea: string;
  carpetAreaUnit: string;
};

export function CommercialAreaSection({
  fields,
  update,
}: {
  fields: AreaFields;
  update: (patch: Partial<AreaFields>) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Super Area</label>
          <MeasuredInput
            value={fields.superArea}
            onValueChange={(value) => update({ superArea: value })}
            unit={fields.superAreaUnit}
            onUnitChange={(unit) => update({ superAreaUnit: unit })}
            unitOptions={BUILDING_AREA_UNIT_OPTIONS}
            placeholder="Super Area"
          />
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={fields.showBuiltUpArea}
            onChange={(e) => update({ showBuiltUpArea: e.target.checked })}
            className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
          />
          <span className="text-sm text-gray-800">Add Built Up Area</span>
        </label>

        {fields.showBuiltUpArea && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Built Up Area</label>
            <MeasuredInput
              value={fields.builtUpArea}
              onValueChange={(value) => update({ builtUpArea: value })}
              unit={fields.builtUpAreaUnit}
              onUnitChange={(unit) => update({ builtUpAreaUnit: unit })}
              unitOptions={BUILDING_AREA_UNIT_OPTIONS}
              placeholder="Built Up Area"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area</label>
          <MeasuredInput
            value={fields.carpetArea}
            onValueChange={(value) => update({ carpetArea: value })}
            unit={fields.carpetAreaUnit}
            onUnitChange={(unit) => update({ carpetAreaUnit: unit })}
            unitOptions={BUILDING_AREA_UNIT_OPTIONS}
            placeholder="Carpet Area"
          />
        </div>
      </div>
    </div>
  );
}

type LeaseFields = {
  currentlyLeasedOut: YesNo;
  monthlyRent: string;
  leasedOn: string;
  currentBusinessSector: string;
  inBusinessSince: string;
  assuredReturns: YesNo;
  rateOfReturn: string;
};

export function CommercialLeaseReturnsSection({
  fields,
  update,
  underlineInputClass,
}: {
  fields: LeaseFields;
  update: (patch: Partial<LeaseFields>) => void;
  underlineInputClass: string;
}) {
  return (
    <div className="space-y-5">
      <YesNoGroup
        label="Currently Leased out"
        name="currentlyLeasedOut"
        value={fields.currentlyLeasedOut}
        onChange={(v) => update({ currentlyLeasedOut: v })}
      />

      {fields.currentlyLeasedOut === 'yes' && (
        <div className="space-y-4 pt-2 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-900">To whom has the property been leased</p>
            <p className="text-sm text-gray-500 mt-1">
              Please specify whether your property has been leased to a company or an individual
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
              <div className="flex items-center border-b border-gray-300">
                <span className="text-gray-500 pr-2">₹</span>
                <input
                  type="text"
                  placeholder="Monthly Rent"
                  value={fields.monthlyRent}
                  onChange={(e) => update({ monthlyRent: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leased On</label>
              <input
                type="date"
                value={fields.leasedOn}
                onChange={(e) => update({ leasedOn: e.target.value })}
                className={underlineInputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Business Sector</label>
              <select
                value={fields.currentBusinessSector}
                onChange={(e) => update({ currentBusinessSector: e.target.value })}
                className={underlineInputClass}
              >
                <option value="">--Select--</option>
                {BUSINESS_SECTOR_OPTIONS.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">In Business Since</label>
              <select
                value={fields.inBusinessSince}
                onChange={(e) => update({ inBusinessSince: e.target.value })}
                className={underlineInputClass}
              >
                <option value="">--Select--</option>
                {IN_BUSINESS_SINCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <YesNoGroup
        label="Assured Returns"
        name="assuredReturns"
        value={fields.assuredReturns}
        onChange={(v) => update({ assuredReturns: v })}
      />

      {fields.assuredReturns === 'yes' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rate Of Return</label>
          <input
            type="text"
            placeholder="E.X:- 5%"
            value={fields.rateOfReturn}
            onChange={(e) => update({ rateOfReturn: e.target.value })}
            className={underlineInputClass}
          />
        </div>
      )}
    </div>
  );
}

export function CommercialPriceSection({
  fields,
  update,
  underlineInputClass,
}: {
  fields: SaleListingCommonFields;
  update: (patch: Partial<SaleListingCommonFields>) => void;
  underlineInputClass: string;
}) {
  return (
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
              ].map(({ key, label }) => (
                <label key={key} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fields[key as keyof SaleListingCommonFields] as boolean}
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
  );
}

export { SaleTransactionSection };
