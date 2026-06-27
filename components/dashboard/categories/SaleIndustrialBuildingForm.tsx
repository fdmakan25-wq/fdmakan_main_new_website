'use client';

import { getNumericOptions, type SaleListingCommonFields } from '@/lib/sale-listing-common';
import {
  LAND_ZONE_OPTIONS,
  parseIndustrialBuildingSaleFields,
  type IndustrialBuildingSaleFields,
  type YesNo,
} from '@/lib/industrial-building-sale-fields';
import SegmentButtonGroup from '@/components/dashboard/form/SegmentButtonGroup';
import {
  BUSINESS_SECTOR_OPTIONS,
  IN_BUSINESS_SINCE_OPTIONS,
} from '@/lib/commercial-office-space-sale-fields';
import {
  CommercialPriceSection,
  SaleTransactionSection,
  YesNoGroup,
} from '@/components/dashboard/categories/sale-commercial-form-parts';

interface SaleIndustrialBuildingFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
  hideSaleSections?: boolean;
}

export default function SaleIndustrialBuildingForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
  hideSaleSections = false,
}: SaleIndustrialBuildingFormProps) {
  const fields = parseIndustrialBuildingSaleFields(rawFields);

  const update = (patch: Partial<IndustrialBuildingSaleFields>) => {
    onChange({ ...fields, ...patch });
  };

  const updateCommon = (patch: Partial<SaleListingCommonFields>) => {
    update(patch);
  };

  const totalFloorPlusOptions = getNumericOptions(30).slice(13);

  const areaUnitSelect = (value: string, onUnitChange: (unit: string) => void, options: string[]) => (
    <select
      value={value}
      onChange={(e) => onUnitChange(e.target.value)}
      className="border-0 border-l border-gray-300 bg-transparent text-sm text-gray-700 pl-2 pr-1 focus:ring-0"
    >
      {options.map((unit) => (
        <option key={unit} value={unit}>{unit}</option>
      ))}
    </select>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Location</h3>
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
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
        <SegmentButtonGroup
          label="Total Floors"
          options={[...getNumericOptions(13), '13+']}
          value={fields.totalFloors}
          onChange={(value) => update({ totalFloors: value })}
          plusOptions={totalFloorPlusOptions}
          plusValue={parseInt(fields.totalFloors, 10) > 13 ? fields.totalFloors : ''}
          onPlusChange={(value) => update({ totalFloors: value })}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Covered Area</label>
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                placeholder="Covered Area"
                value={fields.coveredArea}
                onChange={(e) => update({ coveredArea: e.target.value })}
                className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
              />
              {areaUnitSelect(fields.coveredAreaUnit, (unit) => update({ coveredAreaUnit: unit }), [
                'Sq-ft',
                'Sq-m',
              ])}
            </div>
          </div>

          {!fields.showPlotArea ? (
            <button
              type="button"
              onClick={() => update({ showPlotArea: true })}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-red hover:text-red-700"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-brand-red text-xs">
                +
              </span>
              Plot Area
            </button>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plot Area</label>
              <div className="flex items-center border-b border-gray-300">
                <input
                  type="text"
                  placeholder="Plot Area"
                  value={fields.plotArea}
                  onChange={(e) => update({ plotArea: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
                />
                {areaUnitSelect(fields.plotAreaUnit, (unit) => update({ plotAreaUnit: unit }), [
                  'Sq-yrd',
                  'Sq-ft',
                  'Sq-m',
                ])}
              </div>
            </div>
          )}
        </div>
      </div>

      {!hideSaleSections && (
        <>
      <SaleTransactionSection
        fields={fields}
        update={updateCommon}
        underlineInputClass={underlineInputClass}
      />

      <YesNoGroup
        label="Currently Leased out"
        name="currentlyLeasedOut"
        value={fields.currentlyLeasedOut}
        onChange={(v: YesNo) => update({ currentlyLeasedOut: v })}
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

      <CommercialPriceSection
        fields={fields}
        update={updateCommon}
        underlineInputClass={underlineInputClass}
      />
        </>
      )}
    </div>
  );
}
