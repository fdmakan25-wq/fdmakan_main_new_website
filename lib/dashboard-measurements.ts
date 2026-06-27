export const PLOT_AREA_UNIT_OPTIONS = ['Sq-yrd', 'Sq-ft', 'Sq-m'] as const;
export const BUILDING_AREA_UNIT_OPTIONS = ['Sq-ft', 'Sq-m'] as const;
export const PLOT_DIMENSION_UNIT_OPTIONS = ['yrd', 'ft', 'm'] as const;
export const ROAD_WIDTH_UNIT_OPTIONS = ['Meters', 'Feet'] as const;

/** Allow digits and at most one decimal point. */
export function sanitizeNumericInput(value: string): string {
  if (!value) return '';

  let cleaned = value.replace(/[^\d.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex === -1) return cleaned;

  const beforeDot = cleaned.slice(0, dotIndex + 1);
  const afterDot = cleaned.slice(dotIndex + 1).replace(/\./g, '');
  return beforeDot + afterDot;
}

export function handleNumericInputChange(
  rawValue: string,
  onChange: (value: string) => void
): void {
  onChange(sanitizeNumericInput(rawValue));
}
