import axiosClient from "../AxiosClient";

const PRINT_API_BASE = "/v2/vendor/print";

export const PRINT_CONNECT_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_PRINT_CONNECT_DOWNLOAD_URL ||
  "https://assets.plenti.co.in/plenti-print-connect/latest/Plenti-Print-Connect-setup.exe";

export async function createPrintPairingCode() {
  const { data } = await axiosClient.post(`${PRINT_API_BASE}/pairing-codes`);
  return data;
}

export async function listPrintDevices() {
  const { data } = await axiosClient.get(`${PRINT_API_BASE}/devices`);
  return data;
}

export async function revokePrintDevice(deviceId) {
  const { data } = await axiosClient.delete(`${PRINT_API_BASE}/devices/${deviceId}`);
  return data;
}

export async function reprintOrder(orderId) {
  const { data } = await axiosClient.post(`${PRINT_API_BASE}/orders/${orderId}/reprint`);
  return data;
}

export function formatPairingCountdown(secondsLeft) {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function getPairingSecondsLeft(expiresAt) {
  if (!expiresAt) return 0;
  return Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
}
