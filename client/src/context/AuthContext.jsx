// ============================================
// Auth Context
// ============================================
// Provides authentication state across the app
// Handles login, logout, and user persistence

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Custom hook to access auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * Auth Provider Component
 * Wraps the app and provides auth state
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data.data);
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    /**
     * Register a new user
     */
    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token: newToken, data } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(data);

        return data;
    };

    /**
     * Login user
     */
    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token: newToken, data } = response.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(data);

        return data;
    };

    /**
     * Logout user
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    /**
     * Update user profile
     */
    const updateProfile = async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        setUser(response.data.data);
        return response.data.data;
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
