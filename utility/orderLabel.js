export function orderShortId(orderId) {
  if (!orderId) return "";
  return String(orderId).slice(-4).toUpperCase();
}

export function formatOrderLabel(orderId) {
  const shortId = orderShortId(orderId);
  return shortId ? `#${shortId}` : "—";
}
