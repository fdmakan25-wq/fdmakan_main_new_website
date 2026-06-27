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
import MeasuredInput from '@/components/dashboard/form/MeasuredInput';
import {
  PLOT_AREA_UNIT_OPTIONS,
  ROAD_WIDTH_UNIT_OPTIONS,
} from '@/lib/dashboard-measurements';

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
            <MeasuredInput
              value={fields.roadWidth}
              onValueChange={(value) => update({ roadWidth: value })}
              unit={fields.roadWidthUnit}
              onUnitChange={(unit) => update({ roadWidthUnit: unit })}
              unitOptions={ROAD_WIDTH_UNIT_OPTIONS}
              placeholder="Road width"
            />
          </div>
        </div>
      </div>

      {/* Area */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Area</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plot Area</label>
            <MeasuredInput
              value={fields.plotArea}
              onValueChange={(value) => update({ plotArea: value })}
              unit={fields.plotAreaUnit}
              onUnitChange={(unit) => update({ plotAreaUnit: unit })}
              unitOptions={PLOT_AREA_UNIT_OPTIONS}
              placeholder="Plot Area"
            />
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
