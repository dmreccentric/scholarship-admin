import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ keep cookies for browsers that allow them
});

// Intercept all requests to attach Authorization if available
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🟢 Authorization header set:", token.slice(0, 20) + "...");
  } else {
    console.log("🔴 No token found in sessionStorage");
  }
  return config;
});

export default api;
