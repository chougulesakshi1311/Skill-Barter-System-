import axios from "axios";

const resolveBaseUrl = () => {
  const raw =
    import.meta.env.VITE_API_URL ||
    import.meta.env.REACT_APP_API_URL ||
    "http://localhost:5001";

  return raw.endsWith("/api") ? raw : `${raw}/api`;
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skill_barter_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
