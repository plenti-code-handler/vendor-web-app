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

// Enhanced response interceptor with auto-logout
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("❌ Response error:", error.response?.status);
    
    const errorData = error.response?.data;
    const errorDetail = errorData?.detail;
    
    // List of authentication error messages that should trigger logout
    const authErrorMessages = [
      "Could not validate credentials",
      "Invalid credentials",
      "Token has expired",
      "Authentication failed",
      "Unauthorized",
      "Invalid token",
      "Token expired",
      "Access denied", 
      "Not authenticated"
    ];
    
    // Check if this is an authentication error (detail can be string or array/object)
    const detailStr = typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail || '');
    const isAuthError = 
      error.response?.status === 401 || // Unauthorized
      error.response?.status === 403 || // Forbidden
      (errorDetail && authErrorMessages.some(msg => 
        detailStr.toLowerCase().includes(msg.toLowerCase())
      ));
    
    if (isAuthError) {
      console.log("🔒 Authentication error detected, logging out");

      // Clear all auth data
      localStorage.clear();
      sessionStorage.clear();

      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
