'use client';

import {
  AGE_OF_CONSTRUCTION_OPTIONS,
  BROKERAGE_OPTIONS,
  getMonthOptions,
  getYearOptions,
  MAINTENANCE_FREQUENCY_OPTIONS,
  type SaleListingCommonFields,
} from '@/lib/sale-listing-common';

interface SaleListingSharedSectionsProps {
  fields: SaleListingCommonFields;
  update: (patch: Partial<SaleListingCommonFields>) => void;
  underlineInputClass: string;
  areaPriceHint?: string;
}

export function SaleTransactionSection({
  fields,
  update,
  underlineInputClass,
}: SaleListingSharedSectionsProps) {
  return (
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
                  onChange={() =>
                    update({ transactionType: opt.value as SaleListingCommonFields['transactionType'] })
                  }
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
                  onChange={() =>
                    update({ possessionStatus: opt.value as SaleListingCommonFields['possessionStatus'] })
                  }
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
  );
}

export function SalePriceSection({
  fields,
  update,
  underlineInputClass,
  areaPriceHint,
}: SaleListingSharedSectionsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>

      {areaPriceHint && fields.transactionType === 'new' && fields.possessionStatus === 'under-construction' && (
        <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          {areaPriceHint}
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
