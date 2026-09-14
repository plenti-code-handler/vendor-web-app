const FALLBACK_LOCALE = "en-US";

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function withoutTimezoneAndStyles(options) {
  if (!options) return undefined;
  const { timeZone, dateStyle, timeStyle, ...rest } = options;
  return rest;
}

function callLocale(fn, date, locale, options) {
  if (!isValidDate(date)) return "";
  try {
    return fn.call(date, locale, options);
  } catch {
    try {
      return fn.call(date, FALLBACK_LOCALE, withoutTimezoneAndStyles(options));
    } catch {
      return "";
    }
  }
}

export function safeToLocaleString(date, locale, options) {
  return callLocale(Date.prototype.toLocaleString, date, locale, options);
}

export function safeToLocaleTimeString(date, locale, options) {
  return callLocale(Date.prototype.toLocaleTimeString, date, locale, options);
}

export function safeToLocaleDateString(date, locale, options) {
  return callLocale(Date.prototype.toLocaleDateString, date, locale, options);
}
