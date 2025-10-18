import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import secureStorage from "../utils/secureStorage";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = secureStorage.getToken();
                const savedUser = secureStorage.getUser();

                if (token && savedUser) {
                    setUser(savedUser);
                    // Verify token is still valid
                    try {
                        const currentUser = await authAPI.getUser();
                        setUser(currentUser);
                        secureStorage.setUser(currentUser);
                    } catch (error) {
                        // Token invalid, clear storage
                        secureStorage.clear();
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                setError("Failed to initialize authentication");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);

            // Get CSRF cookie first
            await authAPI.getCsrfCookie();

            const response = await authAPI.login(credentials);
            const { user: userData, token } = response;

            // Store auth data
            secureStorage.setToken(token);
            secureStorage.setUser(userData);
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Login failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            // Get CSRF cookie first
            await authAPI.getCsrfCookie();

            const response = await authAPI.register(userData);
            const { user: newUser, token } = response;

            // Store auth data
            secureStorage.setToken(token);
            secureStorage.setUser(newUser);
            setUser(newUser);

            return { success: true, user: newUser };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Registration failed";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async (logoutAll = false) => {
        try {
            setLoading(true);

            if (logoutAll) {
                await authAPI.logoutAll();
            } else {
                await authAPI.logout();
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear storage regardless of API call success
            secureStorage.clear();
            setUser(null);
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
