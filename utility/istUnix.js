/**
 * Convert HTML date input (YYYY-MM-DD) to Unix seconds for start/end of that day in IST (Asia/Kolkata).
 */
export function istStartOfDayUnix(dateStr) {
  if (!dateStr) return null;
  return Math.floor(new Date(`${dateStr}T00:00:00+05:30`).getTime() / 1000);
}

export function istEndOfDayUnix(dateStr) {
  if (!dateStr) return null;
  return Math.floor(new Date(`${dateStr}T23:59:59+05:30`).getTime() / 1000);
}

export function formatUnixIst(tsSeconds) {
  if (tsSeconds == null) return "—";
  return new Date(tsSeconds * 1000).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
