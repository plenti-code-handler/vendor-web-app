/** Dispatched when vendor should reload recent orders (e.g. FCM new order). */
export const VENDOR_ORDERS_REFRESH_EVENT = "plenti:vendor-orders-refresh";

export function dispatchVendorOrdersRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VENDOR_ORDERS_REFRESH_EVENT));
}
