import axios from "axios";

// 1. Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 2. REQUEST INTERCEPTOR (attach token automatically)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR (global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Unauthorized (401) - global handler triggered");
      }

      if (status === 403) {
        console.warn("Forbidden (403)");
      }

      if (status >= 500) {
        console.warn("Server error (5xx)");
      }
    }

    return Promise.reject(error);
  }
);

// 4. API FUNCTIONS

export const getProducts = () => api.get("/products");

export const getProductById = (id) => api.get(`/products/${id}`);

export const getCart = () => api.get("/cart");

export const getProfile = () => api.get("/users/1");

export const updateProfile = (data) =>
  api.put("/users/1", data);

export default api;