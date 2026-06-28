/** Hourly slots 00:00 … 23:00 (opening). */
export const STORE_OPEN_TIME_OPTIONS = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, "0")}:00`
);

/** Same plus 24:00 for closing (end of calendar day). */
export const STORE_CLOSE_TIME_OPTIONS = [...STORE_OPEN_TIME_OPTIONS, "24:00"];
export const STORE_HOURS_TIMEZONE = "Asia/Kolkata";

export function timeSelectOptionsIncludingValue(selected, baseOptions) {
  if (!selected || baseOptions.includes(selected)) return baseOptions;
  return [selected, ...baseOptions];
}

/** `"HH:mm"` → minutes since midnight. `"24:00"` → last minute of the day (inclusive with same-day spans). */
function toMinutes(hhmm) {
  const raw = String(hhmm ?? "")
    .trim()
    .replace(/\u202f/g, "");
  if (!raw || raw === "24:00") return raw === "24:00" ? 23 * 60 + 59 : NaN;
  const [h, m] = raw.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Unix (seconds or ms) or Date → IST wall time `"HH:mm"`, then same `isBetween` as open/close strings.
 */
export function isUnixInstantWithinOpeningWindow(
  unixTs,
  openHhMm,
  closeHhMm,
  timeZone = STORE_HOURS_TIMEZONE
) {
    console.log(unixTs)   
    const close = String(closeHhMm ?? "").trim();
    if (!close) return true;

    const targetHhMm = new Date(unixTs*1000).toLocaleTimeString("en-IN", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    console.log(targetHhMm, openHhMm, closeHhMm)
    const [t, s, e] = [targetHhMm, openHhMm, close].map(toMinutes);

    if (![t, s, e].every(Number.isFinite)) return true;

    return s <= e ? t >= s && t <= e : t >= s || t <= e;
}
