'use client';

interface SegmentButtonGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  plusOptions?: string[];
  plusValue?: string;
  onPlusChange?: (value: string) => void;
}

export default function SegmentButtonGroup({
  label,
  options,
  value,
  onChange,
  plusOptions,
  plusValue,
  onPlusChange,
}: SegmentButtonGroupProps) {
  const plusOption = options[options.length - 1];
  const isPlusSelected = plusOptions && value.startsWith(String(parseInt(plusOption, 10) || ''));

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap">
        {options.map((option, index) => {
          const isPlus = plusOptions && index === options.length - 1;
          const selected = isPlus ? isPlusSelected || value === option : value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`px-3 py-2 text-sm border border-gray-300 -ml-px first:ml-0 first:rounded-l-md last:rounded-r-md transition ${
                selected
                  ? 'bg-red-50 text-brand-red border-brand-red z-10 relative font-medium'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
              {isPlus && <span className="ml-1 text-xs">▾</span>}
            </button>
          );
        })}
      </div>
      {plusOptions && (isPlusSelected || plusValue) && onPlusChange && (
        <select
          value={plusValue || value}
          onChange={(e) => onPlusChange(e.target.value)}
          className="mt-2 text-sm border border-gray-300 rounded-md px-3 py-1.5 text-gray-900 bg-white"
        >
          <option value="">Select</option>
          {plusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
