import axios from "axios";
import { toast } from "sonner";

const baseURL = "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = localStorage.getItem("token");

export const getAccessToken = () => {
  return accessToken || localStorage.getItem("token");
};

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = error.response?.data?.message || error.message || "Infrastructure request failed.";
    
    if (error.response?.status === 401) {
      setAccessToken(null);
      // Optionally redirect to login or handle refresh
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
