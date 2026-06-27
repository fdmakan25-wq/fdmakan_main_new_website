'use client';

import {
  AGE_OF_CONSTRUCTION_OPTIONS,
  BROKERAGE_OPTIONS,
  MAINTENANCE_FREQUENCY_OPTIONS,
  parseRentListingFields,
  type AvailableFromType,
  type RentListingFields,
  type YesNo,
} from '@/lib/rent-listing-common';
import { YesNoGroup } from '@/components/dashboard/categories/sale-commercial-form-parts';

interface RentListingSharedSectionsProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
}

export default function RentListingSharedSections({
  fields: rawFields,
  onChange,
  underlineInputClass,
}: RentListingSharedSectionsProps) {
  const fields = parseRentListingFields(rawFields);

  const update = (patch: Partial<RentListingFields>) => {
    onChange({ ...rawFields, ...fields, ...patch });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction Type, Property Availability
        </h3>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Available From</p>
            <div className="flex flex-wrap gap-6">
              {[
                { value: 'select-date', label: 'Select Date' },
                { value: 'immediately', label: 'Immediately' },
              ].map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availableFromType"
                    checked={fields.availableFromType === opt.value}
                    onChange={() =>
                      update({ availableFromType: opt.value as AvailableFromType })
                    }
                    className="h-4 w-4 text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-sm text-gray-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {fields.availableFromType === 'select-date' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available From Date</label>
              <input
                type="date"
                value={fields.availableFromDate}
                onChange={(e) => update({ availableFromDate: e.target.value })}
                className={underlineInputClass}
              />
            </div>
          )}

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

          <YesNoGroup
            label="Currently Rent out"
            name="currentlyRentOut"
            value={fields.currentlyRentOut}
            onChange={(v: YesNo) => update({ currentlyRentOut: v })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rent/ Lease Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
            <input
              type="text"
              placeholder="Enter Total Rent"
              value={fields.monthlyRent}
              onChange={(e) => update({ monthlyRent: e.target.value })}
              className={underlineInputClass}
            />
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fields.electricityWaterExcluded}
              onChange={(e) => update({ electricityWaterExcluded: e.target.checked })}
              className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
            />
            <span className="text-sm text-gray-800">Electricity & Water charges excluded.</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Security Amount</label>
            <div className="flex items-center border-b border-gray-300">
              <span className="text-gray-500 pr-2">₹</span>
              <input
                type="text"
                placeholder="Security Amount"
                value={fields.securityAmount}
                onChange={(e) => update({ securityAmount: e.target.value })}
                className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
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
                  className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
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
      </div>
    </div>
  );
}
