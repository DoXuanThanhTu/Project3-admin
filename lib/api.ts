// lib/api.ts
import axios from "axios";
// const API_URL =
//   process.env.NEXT_PUBLIC_ENV === "development"
//     ? process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_API_URL
//     : process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_API_URL;
const API_URL =
  process.env.NEXT_PUBLIC_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_API_URL
    : process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  try {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      const authData = JSON.parse(raw);
      const token = authData?.state?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error("Failed to parse auth-storage", err);
  }

  return config;
});

export default api;
