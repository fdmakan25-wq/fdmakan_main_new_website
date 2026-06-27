'use client';

import { getNumericOptions, type SaleListingCommonFields } from '@/lib/sale-listing-common';
import {
  getFloorPlusOptions,
  TOTAL_FLOORS_SEGMENT_MAX,
} from '@/lib/flat-apartment-sale-fields';
import {
  CABIN_MEETING_ROOM_OPTIONS,
  FLOOR_NO_OPTIONS,
  parseCommercialOfficeSpaceSaleFields,
  type CommercialOfficeSpaceSaleFields,
} from '@/lib/commercial-office-space-sale-fields';
import SegmentButtonGroup from '@/components/dashboard/form/SegmentButtonGroup';
import {
  CommercialAreaSection,
  CommercialLeaseReturnsSection,
  CommercialPriceSection,
  CommercialPropertyLocationSection,
  FurnishedStatusGroup,
  PantryCafeteriaGroup,
  SaleTransactionSection,
  YesNoGroup,
} from '@/components/dashboard/categories/sale-commercial-form-parts';

interface SaleCommercialOfficeSpaceFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
  hideSaleSections?: boolean;
}

export default function SaleCommercialOfficeSpaceForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
  hideSaleSections = false,
}: SaleCommercialOfficeSpaceFormProps) {
  const fields = parseCommercialOfficeSpaceSaleFields(rawFields);

  const update = (patch: Partial<CommercialOfficeSpaceSaleFields>) => {
    onChange({ ...fields, ...patch });
  };

  const updateCommon = (patch: Partial<SaleListingCommonFields>) => {
    update(patch);
  };

  const floorPlusOptions = getFloorPlusOptions(5);
  const totalFloorPlusOptions = getFloorPlusOptions(TOTAL_FLOORS_SEGMENT_MAX);
  const washroomPlusOptions = ['4', '5', '6'];

  return (
    <div className="space-y-8">
      <CommercialPropertyLocationSection
        fields={fields}
        update={update}
        underlineInputClass={underlineInputClass}
      />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
        <div className="space-y-5">
          <SegmentButtonGroup
            label="Floor No."
            options={[...FLOOR_NO_OPTIONS, '5+']}
            value={fields.floorNo}
            onChange={(value) => update({ floorNo: value })}
            plusOptions={floorPlusOptions}
            plusValue={parseInt(fields.floorNo, 10) > 5 ? fields.floorNo : ''}
            onPlusChange={(value) => update({ floorNo: value })}
          />

          <SegmentButtonGroup
            label="Total Floors"
            options={[...getNumericOptions(TOTAL_FLOORS_SEGMENT_MAX), '13+']}
            value={fields.totalFloors}
            onChange={(value) => update({ totalFloors: value })}
            plusOptions={totalFloorPlusOptions}
            plusValue={parseInt(fields.totalFloors, 10) > TOTAL_FLOORS_SEGMENT_MAX ? fields.totalFloors : ''}
            onPlusChange={(value) => update({ totalFloors: value })}
          />

          <FurnishedStatusGroup
            value={fields.furnishedStatus}
            onChange={(value) => update({ furnishedStatus: value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SegmentButtonGroup
              label="Washrooms"
              options={['0', '1', '2', '3', '3+']}
              value={fields.washrooms}
              onChange={(value) => update({ washrooms: value })}
              plusOptions={washroomPlusOptions}
              plusValue={parseInt(fields.washrooms, 10) > 3 ? fields.washrooms : ''}
              onPlusChange={(value) => update({ washrooms: value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Seats</label>
              <input
                type="text"
                placeholder="Enter Number"
                value={fields.numberOfSeats}
                onChange={(e) => update({ numberOfSeats: e.target.value })}
                className={underlineInputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cabin/Meeting Rooms</label>
            <select
              value={fields.cabinMeetingRooms}
              onChange={(e) => update({ cabinMeetingRooms: e.target.value })}
              className={underlineInputClass}
            >
              <option value="">Select</option>
              {CABIN_MEETING_ROOM_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <YesNoGroup
            label="Personal Washroom"
            name="personalWashroom"
            value={fields.personalWashroom}
            onChange={(v) => update({ personalWashroom: v })}
          />

          <PantryCafeteriaGroup
            name="pantryCafeteria"
            value={fields.pantryCafeteria}
            onChange={(v) => update({ pantryCafeteria: v })}
          />
        </div>
      </div>

      <CommercialAreaSection fields={fields} update={update} />

      {!hideSaleSections && (
        <>
      <SaleTransactionSection
        fields={fields}
        update={updateCommon}
        underlineInputClass={underlineInputClass}
      />

      <CommercialLeaseReturnsSection
        fields={fields}
        update={update}
        underlineInputClass={underlineInputClass}
      />

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
