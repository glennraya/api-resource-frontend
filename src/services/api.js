import axios from "axios";
import secureStorage from "../utils/secureStorage";

// Create axios instance
const api = axios.create({
    baseURL: "", // Use relative URLs to go through Vite proxy
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // Important for CSRF cookies
});

// Helper function to get CSRF token from cookies
const getCsrfToken = () => {
    const name = "XSRF-TOKEN";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
};

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
    (config) => {
        const token = secureStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token for state-changing requests
        if (
            ["post", "put", "patch", "delete"].includes(
                config.method?.toLowerCase()
            )
        ) {
            const csrfToken = getCsrfToken();
            if (csrfToken) {
                config.headers["X-XSRF-TOKEN"] = csrfToken;
            }
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
    async (error) => {
        if (error.response?.status === 401) {
            // Session expired or invalid
            secureStorage.clear();
            window.location.href = "/login";
        } else if (error.response?.status === 419) {
            // CSRF token mismatch - try to refresh the CSRF cookie and retry
            try {
                await api.get("/sanctum/csrf-cookie");
                // Retry the original request
                return api.request(error.config);
            } catch (retryError) {
                console.error("Failed to refresh CSRF token:", retryError);
            }
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

    // Fetch all users
    async fetchUsers() {
        const response = await api.get("/api/users");
        return response.data;
    },

    // Logout current session
    async logout() {
        const response = await api.post("/api/logout");
        return response.data;
    },
};

export default api;
