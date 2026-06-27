'use client';

import { type SaleListingCommonFields } from '@/lib/sale-listing-common';
import {
  parseCommercialShopSaleFields,
  type CommercialShopSaleFields,
} from '@/lib/commercial-shop-sale-fields';
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

interface SaleCommercialShopFormProps {
  fields: Record<string, unknown>;
  onChange: (fields: Record<string, unknown>) => void;
  underlineInputClass: string;
  hideSaleSections?: boolean;
}

export default function SaleCommercialShopForm({
  fields: rawFields,
  onChange,
  underlineInputClass,
  hideSaleSections = false,
}: SaleCommercialShopFormProps) {
  const fields = parseCommercialShopSaleFields(rawFields);

  const update = (patch: Partial<CommercialShopSaleFields>) => {
    onChange({ ...fields, ...patch });
  };

  const updateCommon = (patch: Partial<SaleListingCommonFields>) => {
    update(patch);
  };

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
          <FurnishedStatusGroup
            value={fields.furnishedStatus}
            onChange={(value) => update({ furnishedStatus: value })}
          />

          <YesNoGroup
            label="Corner Shop"
            name="cornerShop"
            value={fields.cornerShop}
            onChange={(v) => update({ cornerShop: v })}
          />

          <YesNoGroup
            label="Is Main Road Facing"
            name="isMainRoadFacing"
            value={fields.isMainRoadFacing}
            onChange={(v) => update({ isMainRoadFacing: v })}
          />

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
