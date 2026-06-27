'use client';

import { handleNumericInputChange } from '@/lib/dashboard-measurements';

type UnitOptions =
  | typeof PLOT_AREA_UNIT_OPTIONS
  | typeof BUILDING_AREA_UNIT_OPTIONS
  | typeof PLOT_DIMENSION_UNIT_OPTIONS
  | typeof ROAD_WIDTH_UNIT_OPTIONS
  | readonly string[];

interface MeasuredInputProps {
  value: string;
  onValueChange: (value: string) => void;
  unit: string;
  onUnitChange?: (unit: string) => void;
  unitOptions?: UnitOptions;
  placeholder?: string;
}

const unitSelectClass =
  'border-0 border-l border-gray-300 bg-white text-sm text-gray-700 pl-2 pr-6 py-2 focus:ring-0 cursor-pointer';

export default function MeasuredInput({
  value,
  onValueChange,
  unit,
  onUnitChange,
  unitOptions,
  placeholder,
}: MeasuredInputProps) {
  const showUnitDropdown = Boolean(unitOptions?.length && onUnitChange);

  return (
    <div className="flex items-center border-b border-gray-300">
      <input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleNumericInputChange(e.target.value, onValueChange)}
        className="flex-1 border-0 px-0 py-2.5 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
      />
      {showUnitDropdown ? (
        <select
          value={unit}
          onChange={(e) => onUnitChange?.(e.target.value)}
          className={unitSelectClass}
          aria-label="Unit"
        >
          {unitOptions!.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <span className="text-sm text-gray-500 pl-2 pr-1 whitespace-nowrap">{unit}</span>
      )}
    </div>
  );
}

interface PlotLengthBreadthFieldsProps {
  length: string;
  breadth: string;
  dimensionUnit: string;
  onLengthChange: (value: string) => void;
  onBreadthChange: (value: string) => void;
  onDimensionUnitChange: (unit: string) => void;
  unitOptions?: UnitOptions;
}

export function PlotLengthBreadthFields({
  length,
  breadth,
  dimensionUnit,
  onLengthChange,
  onBreadthChange,
  onDimensionUnitChange,
  unitOptions,
}: PlotLengthBreadthFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700">Plot Length & Breadth</span>
        {unitOptions?.length ? (
          <select
            value={dimensionUnit}
            onChange={(e) => onDimensionUnitChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1.5 text-gray-900 bg-white"
            aria-label="Length and breadth unit"
          >
            {unitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Length</label>
          <MeasuredInput
            value={length}
            onValueChange={onLengthChange}
            unit={dimensionUnit}
            placeholder="Plot Length"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Breadth</label>
          <MeasuredInput
            value={breadth}
            onValueChange={onBreadthChange}
            unit={dimensionUnit}
            placeholder="Plot Breadth"
          />
        </div>
      </div>
    </div>
  );
}
