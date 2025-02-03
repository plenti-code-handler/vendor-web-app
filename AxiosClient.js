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
  return config;
});

export default axiosClient;

export const axiosFormClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "multipart/form-data", // Set header for FormData
  },
});

// Add a request interceptor to pass the token with each request
axiosFormClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
