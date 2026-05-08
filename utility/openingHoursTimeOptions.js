/** Hourly slots 00:00 … 23:00 (opening). */
export const STORE_OPEN_TIME_OPTIONS = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, "0")}:00`
);

/** Same plus 24:00 for closing (end of calendar day). */
export const STORE_CLOSE_TIME_OPTIONS = [...STORE_OPEN_TIME_OPTIONS, "24:00"];

/**
 * If Places returns e.g. 11:30 and the select is hourly-only, show that value anyway.
 */
export function timeSelectOptionsIncludingValue(selected, baseOptions) {
  if (!selected || baseOptions.includes(selected)) return baseOptions;
  return [selected, ...baseOptions];
}
