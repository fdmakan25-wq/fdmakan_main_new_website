'use client';

import {
  BROKERAGE_OPTIONS,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';
import {
  OPEN_SIDES_OPTIONS,
  parseResidentialLandPlotSaleFields,
  type ResidentialLandPlotSaleFields,
  type YesNo,
} from '@/lib/residential-land-plot-sale-fields';

interface SaleResidentialLandPlotFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
}

function YesNoGroup({
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

export default function SaleResidentialLandPlotForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
}: SaleResidentialLandPlotFormProps) {
  const fields = parseResidentialLandPlotSaleFields(rawFields);

  const update = (patch: Partial<ResidentialLandPlotSaleFields>) => {
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

          <YesNoGroup
            label="Any Construction done"
            name="constructionDone"
            value={fields.constructionDone}
            onChange={(v) => update({ constructionDone: v })}
          />
          <YesNoGroup
            label="Boundary wall made"
            name="boundaryWall"
            value={fields.boundaryWall}
            onChange={(v) => update({ boundaryWall: v })}
          />
          <YesNoGroup
            label="Is in a gated colony"
            name="gatedColony"
            value={fields.gatedColony}
            onChange={(v) => update({ gatedColony: v })}
          />
        </div>
      </div>

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
              <select
                value={fields.plotAreaUnit}
                onChange={(e) => update({ plotAreaUnit: e.target.value })}
                className="border-0 border-l border-gray-300 bg-transparent text-sm text-gray-700 pl-2 pr-1 focus:ring-0"
              >
                <option value="Sq-yrd">Sq-yrd</option>
                <option value="Sq-ft">Sq-ft</option>
                <option value="Sq-m">Sq-m</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plot Length</label>
              <div className="flex items-center border-b border-gray-300">
                <input
                  type="text"
                  placeholder="Plot Length"
                  value={fields.plotLength}
                  onChange={(e) => update({ plotLength: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
                />
                <span className="text-sm text-gray-500 pl-2">{fields.plotDimensionUnit}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plot Breadth</label>
              <div className="flex items-center border-b border-gray-300">
                <input
                  type="text"
                  placeholder="Plot Breadth"
                  value={fields.plotBreadth}
                  onChange={(e) => update({ plotBreadth: e.target.value })}
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
                />
                <span className="text-sm text-gray-500 pl-2">{fields.plotDimensionUnit}</span>
              </div>
            </div>
          </div>

          <YesNoGroup
            label="Is this a corner plot?"
            name="isCornerPlot"
            value={fields.isCornerPlot}
            onChange={(v) => update({ isCornerPlot: v })}
          />
        </div>
      </div>

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
                  name="landTransactionType"
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
    </div>
  );
}
