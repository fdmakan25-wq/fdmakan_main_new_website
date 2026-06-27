'use client';

import { BROKERAGE_OPTIONS, type SaleListingCommonFields } from '@/lib/sale-listing-common';
import {
  OPEN_SIDES_OPTIONS,
  parseIndustrialLandSaleFields,
  type IndustrialLandSaleFields,
  type YesNo,
} from '@/lib/industrial-land-sale-fields';
import { YesNoGroup } from '@/components/dashboard/categories/sale-commercial-form-parts';
import MeasuredInput, { PlotLengthBreadthFields } from '@/components/dashboard/form/MeasuredInput';
import {
  PLOT_AREA_UNIT_OPTIONS,
  PLOT_DIMENSION_UNIT_OPTIONS,
  ROAD_WIDTH_UNIT_OPTIONS,
} from '@/lib/dashboard-measurements';

interface SaleIndustrialLandFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
  hideSaleSections?: boolean;
}

export default function SaleIndustrialLandForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
  hideSaleSections = false,
}: SaleIndustrialLandFormProps) {
  const fields = parseIndustrialLandSaleFields(rawFields);

  const update = (patch: Partial<IndustrialLandSaleFields>) => {
    onChange({ ...fields, ...patch });
  };

  const updateCommon = (patch: Partial<SaleListingCommonFields>) => {
    update(patch);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
        <div className="space-y-5">
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

          <div>
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

          <YesNoGroup
            label="Any Construction done"
            name="constructionDone"
            value={fields.constructionDone}
            onChange={(v: YesNo) => update({ constructionDone: v })}
          />
          <YesNoGroup
            label="Boundary wall made"
            name="boundaryWall"
            value={fields.boundaryWall}
            onChange={(v: YesNo) => update({ boundaryWall: v })}
          />
        </div>
      </div>

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

          <PlotLengthBreadthFields
            length={fields.plotLength}
            breadth={fields.plotBreadth}
            dimensionUnit={fields.plotDimensionUnit}
            onLengthChange={(value) => update({ plotLength: value })}
            onBreadthChange={(value) => update({ plotBreadth: value })}
            onDimensionUnitChange={(unit) => update({ plotDimensionUnit: unit })}
            unitOptions={PLOT_DIMENSION_UNIT_OPTIONS}
          />

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.isCornerPlot}
              onChange={(e) => update({ isCornerPlot: e.target.checked })}
              className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
            />
            <span className="text-sm text-gray-800">This is a corner plot</span>
          </label>
        </div>
      </div>

      {!hideSaleSections && (
        <>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Type, Property Availability</h3>
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
                  name="industrialLandTransactionType"
                  checked={fields.transactionType === opt.value}
                  onChange={() =>
                    updateCommon({ transactionType: opt.value as SaleListingCommonFields['transactionType'] })
                  }
                  className="h-4 w-4 text-brand-red focus:ring-brand-red"
                />
                <span className="text-sm text-gray-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Price</label>
              <input
                type="text"
                placeholder="Enter Total Price"
                value={fields.expectedPrice}
                onChange={(e) => updateCommon({ expectedPrice: e.target.value })}
                className={underlineInputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per Sq-yrd</label>
              <div className="flex items-center border-b border-gray-300">
                <span className="text-gray-500 pr-2">₹</span>
                <input
                  type="text"
                  value={fields.pricePerSqft}
                  onChange={(e) => updateCommon({ pricePerSqft: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
                />
              </div>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.stampDutyExcluded}
              onChange={(e) => updateCommon({ stampDutyExcluded: e.target.checked })}
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
                onChange={(e) => updateCommon({ bookingTokenAmount: e.target.value })}
                className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brokerage (Brokers only)</label>
            <select
              value={fields.brokerage}
              onChange={(e) => updateCommon({ brokerage: e.target.value })}
              className={underlineInputClass}
            >
              <option value="">Select Brokerage</option>
              {BROKERAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
