'use client';

import {
  getNumericOptions,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import {
  OPEN_SIDES_OPTIONS,
  parseResidentialHouseSaleFields,
  type ResidentialHouseSaleFields,
} from '@/lib/residential-house-sale-fields';
import {
  SalePriceSection,
  SaleTransactionSection,
} from '@/components/dashboard/categories/SaleListingSharedSections';

interface SaleResidentialHouseFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
  hideSaleSections?: boolean;
}

export default function SaleResidentialHouseForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
  hideSaleSections = false,
}: SaleResidentialHouseFormProps) {
  const fields = parseResidentialHouseSaleFields(rawFields);

  const update = (patch: Partial<ResidentialHouseSaleFields>) => {
    onChange({ ...fields, ...patch });
  };

  const updateCommon = (patch: Partial<SaleListingCommonFields>) => {
    update(patch);
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
      {/* Property Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Floors Allowed for construction
            </label>
            <select
              value={fields.floorsAllowedConstruction}
              onChange={(e) => update({ floorsAllowedConstruction: e.target.value })}
              className={underlineInputClass}
            >
              <option value="">Select</option>
              {getNumericOptions(50).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">No of open sides</label>
            <select
              value={fields.openSides}
              onChange={(e) => update({ openSides: e.target.value })}
              className={underlineInputClass}
            >
              <option value="">Select</option>
              {OPEN_SIDES_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width of road facing the plot
            </label>
            <div className="flex items-center border-b border-gray-300">
              <input
                type="text"
                placeholder="Road width"
                value={fields.roadWidth}
                onChange={(e) => update({ roadWidth: e.target.value })}
                className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
              />
              <span className="text-sm text-gray-500 pl-2">Meters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Area */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
        <div className="space-y-5">
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
              {areaUnitSelect(fields.plotAreaUnit, (unit) => update({ plotAreaUnit: unit }))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Is this a corner plot?</p>
            <div className="flex flex-wrap gap-6">
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isCornerPlot"
                    checked={fields.isCornerPlot === opt.value}
                    onChange={() => update({ isCornerPlot: opt.value as ResidentialHouseSaleFields['isCornerPlot'] })}
                    className="h-4 w-4 text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!hideSaleSections && (
        <>
      <SaleTransactionSection
        fields={fields}
        update={updateCommon}
        underlineInputClass={underlineInputClass}
      />

      <SalePriceSection
        fields={fields}
        update={updateCommon}
        underlineInputClass={underlineInputClass}
        areaPriceHint="If Plot Area is entered, all price calculations will be done on the Plot Area."
      />
        </>
      )}
    </div>
  );
}
