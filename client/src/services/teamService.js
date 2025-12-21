// ============================================
// Team Service
// ============================================
// API calls for team operations

import api from './api';

/**
 * Get user's teams (as owner or member)
 */
export const getMyTeams = async () => {
    const response = await api.get('/teams/my');
    return response.data;
};

/**
 * Get a single team by ID
 */
export const getTeam = async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
};

/**
 * Get team by opening ID
 */
export const getTeamByOpening = async (openingId) => {
    const response = await api.get(`/teams/opening/${openingId}`);
    return response.data;
};
