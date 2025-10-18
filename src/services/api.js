import axios from "axios";
import secureStorage from "../utils/secureStorage";

// Create axios instance
const api = axios.create({
    baseURL: "http://api-resource.test",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Important for CSRF cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = secureStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Session expired or invalid
            secureStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Auth API methods
export const authAPI = {
    // Get CSRF cookie (required for SPA)
    async getCsrfCookie() {
        await api.get("/sanctum/csrf-cookie");
    },

    // Register user
    async register(userData) {
        const response = await api.post("/api/register", userData);
        return response.data;
    },

    // Login user
    async login(credentials) {
        const response = await api.post("/api/login", credentials);
        return response.data;
    },

    // Get current user
    async getUser() {
        const response = await api.get("/api/user");
        return response.data;
    },

    // Logout current session
    async logout() {
        const response = await api.post("/api/logout");
        return response.data;
    },
};

export default api;
