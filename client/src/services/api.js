// ============================================
// API Service
// ============================================
// Axios instance configured for the StackUp API
// Handles auth headers and error interceptors

import axios from 'axios';
import { isDemoMode, demoAdapter } from './demoData';

// Resolve the real network adapter once (xhr/fetch in the browser)
const realAdapter = axios.getAdapter(axios.defaults.adapter);

// Create axios instance.
// In demo mode every request is served from in-memory mock data
// (see demoData.js) so the app works with no backend.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    adapter: (config) => (isDemoMode() ? demoAdapter(config) : realAdapter(config))
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
