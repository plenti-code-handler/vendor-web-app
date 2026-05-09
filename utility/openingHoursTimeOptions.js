/** Hourly slots 00:00 … 23:00 (opening). */
export const STORE_OPEN_TIME_OPTIONS = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, "0")}:00`
);

/** Same plus 24:00 for closing (end of calendar day). */
export const STORE_CLOSE_TIME_OPTIONS = [...STORE_OPEN_TIME_OPTIONS, "24:00"];

/**
 * Maps a time string to the hour index `0 … 23` matching {@link STORE_OPEN_TIME_OPTIONS}
 * (`"00:00"` → 0, `"11:00"` → 11, …).
 * Prefers an exact option match; otherwise uses the `HH` part of `HH:MM` (e.g. Places `11:30` → 11).
 *
 * For **closing** only: `"24:00"` maps to index `23` (last hourly slot before midnight → same semantics as earlier validation).
 *
 * All times are **24-hour**. Example: open `11:00`, close `04:00` → open index 11, close index 4,
 * interpreted as overnight (11→next morning 04), **not** a same-day slice.
 *
 * @param {string} hhmm `"11:00"`, `"04:00"`, `"24:00"` …
 * @param {{ allow24Close?: boolean }} [opts]
 */
export function storeTimeToHourIndex(hhmm, opts = {}) {
  const allow24Close = opts.allow24Close === true;
  const raw = String(hhmm ?? "").trim();
  if (!raw) return null;
  if (allow24Close && raw === "24:00") return 23;

  const exactIdx = STORE_OPEN_TIME_OPTIONS.indexOf(raw);
  if (exactIdx !== -1) return exactIdx;

  const hPart = raw.split(":")[0];
  const h = parseInt(String(hPart), 10);
  if (Number.isNaN(h) || h < 0 || h > 23) return null;
  return h;
}

/**
 * Whether the IST **hour** of `windowEnd` (index `0 … 23`, same numbering as STORE_OPEN_TIME_OPTIONS)
 * lies in the business window from open index to close index.
 *
 * - If `openIndex <= closeIndex` (e.g. 09→17): inclusive range **within the same calendar day**.
 * - If `openIndex > closeIndex` (e.g. 11→04): **overnight** — valid hours are indices
 *   `openIndex … 23` **or** `0 … closeIndex` (wrapping along the STORE_OPEN_TIME_OPTIONS array).
 *
 * @param {number | null | undefined} openIndex
 * @param {number | null | undefined} closeIndex
 * @param {number | null | undefined} endHourIndex IST hour-of-day for window end (`0 … 23`)
 */
export function isPickupEndHourIndexWithinStoreHourIndices(
  openIndex,
  closeIndex,
  endHourIndex
) {
  if (
    openIndex == null ||
    closeIndex == null ||
    endHourIndex == null ||
    typeof openIndex !== "number" ||
    typeof closeIndex !== "number" ||
    typeof endHourIndex !== "number"
  ) {
    return false;
  }

  const o = Math.min(Math.max(openIndex, 0), STORE_OPEN_TIME_OPTIONS.length - 1);
  const c = Math.min(Math.max(closeIndex, 0), STORE_OPEN_TIME_OPTIONS.length - 1);
  const e = Math.min(Math.max(endHourIndex, 0), STORE_OPEN_TIME_OPTIONS.length - 1);

  // Same labelled-day segment on the hourly ring (e.g. 09:00–17:00)
  if (o <= c) {
    return e >= o && e <= c;
  }
  // Overnight: e.g. 11:00 → next morning 04:00 (indices wrap on STORE_OPEN_TIME_OPTIONS)
  return e >= o || e <= c;
}

/** Hour index `0 … 23` (IST) for `date`, aligned with {@link STORE_OPEN_TIME_OPTIONS}. */
export function getIstHourIndexFromDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  }).formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")?.value);
  return Number.isNaN(h) ? null : Math.min(Math.max(h, 0), STORE_OPEN_TIME_OPTIONS.length - 1);
}

/**
 * If Places returns e.g. 11:30 and the select is hourly-only, show that value anyway.
 */
export function timeSelectOptionsIncludingValue(selected, baseOptions) {
  if (!selected || baseOptions.includes(selected)) return baseOptions;
  return [selected, ...baseOptions];
}
