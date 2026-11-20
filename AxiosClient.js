import axios from "axios";
import { baseUrl } from "./utility/BaseURL";

const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to pass the token with each request
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Parent -> outlet routing: use the same parent token but pass the outlet id.
  const role = localStorage.getItem("role");
  const targetVendorId = localStorage.getItem("target_vendor_id");
  if (role === "PARENT" && targetVendorId) {
    config.headers["X-Vendor-ID"] = targetVendorId;
  }

  return config;
});

export const axiosFormClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add a request interceptor to pass the token with each request
axiosFormClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const role = localStorage.getItem("role");
  const targetVendorId = localStorage.getItem("target_vendor_id");
  if (role === "PARENT" && targetVendorId) {
    config.headers["X-Vendor-ID"] = targetVendorId;
  }

  return config;
});

const TOKEN_INVALID_MESSAGES = [
  "could not validate credentials",
  "invalid token",
  "token has expired",
  "token expired",
  "not authenticated",
  "authentication failed",
];

const requestSentToken = (config) => Boolean(config?.headers?.Authorization);

const isLoginRequest = (config) => {
  const url = `${config?.baseURL || ""}${config?.url || ""}`;
  return url.includes("/login");
};

// Sign out only when a stored token was sent and the server rejected it.
// Login failures stay on the form so the caller can show its own error.
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorDetail = error.response?.data?.detail;
    const detailStr = typeof errorDetail === "string"
      ? errorDetail
      : JSON.stringify(errorDetail || "");
    const detailSaysTokenInvalid = TOKEN_INVALID_MESSAGES.some((message) =>
      detailStr.toLowerCase().includes(message)
    );
    const invalidToken =
      requestSentToken(error.config) &&
      !isLoginRequest(error.config) &&
      (error.response?.status === 401 || detailSaysTokenInvalid);

    if (invalidToken) {
      localStorage.clear();
      sessionStorage.clear();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
