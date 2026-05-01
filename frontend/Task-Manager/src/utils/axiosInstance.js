
import axios from "axios";
import { BASE_URL } from "./apiPaths";

// ✅ CREATE INSTANCE
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR (TOKEN AUTO ADD)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 DEBUG (optional)
    console.log("API Request:", config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    // 🔥 DEBUG
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      if (error.response.status === 401) {
        // ❗ Token expired / invalid
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (error.response.status === 500) {
        console.error("Server error, please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout!");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;