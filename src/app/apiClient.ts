import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.recomind.site/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
