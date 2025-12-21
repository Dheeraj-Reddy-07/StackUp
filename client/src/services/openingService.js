// ============================================
// Opening Service
// ============================================
// API calls for opening operations

import api from './api';

/**
 * Get all openings with optional filters
 */
export const getOpenings = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.projectType) params.append('projectType', filters.projectType);
    if (filters.skills) params.append('skills', filters.skills);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/openings?${params.toString()}`);
    return response.data;
};

/**
 * Get a single opening by ID
 */
export const getOpening = async (id) => {
    const response = await api.get(`/openings/${id}`);
    return response.data;
};

/**
 * Create a new opening
 */
export const createOpening = async (openingData) => {
    const response = await api.post('/openings', openingData);
    return response.data;
};

/**
 * Update an opening
 */
export const updateOpening = async (id, openingData) => {
    const response = await api.put(`/openings/${id}`, openingData);
    return response.data;
};

/**
 * Delete an opening
 */
export const deleteOpening = async (id) => {
    const response = await api.delete(`/openings/${id}`);
    return response.data;
};

/**
 * Get user's own openings
 */
export const getMyOpenings = async () => {
    const response = await api.get('/openings/user/my');
    return response.data;
};
