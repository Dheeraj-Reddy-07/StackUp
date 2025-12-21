// ============================================
// Application Service
// ============================================
// API calls for application operations

import api from './api';

/**
 * Submit an application to an opening
 */
export const createApplication = async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
};

/**
 * Get user's own applications
 */
export const getMyApplications = async () => {
    const response = await api.get('/applications/my');
    return response.data;
};

/**
 * Get applications for a specific opening
 */
export const getOpeningApplications = async (openingId) => {
    const response = await api.get(`/applications/opening/${openingId}`);
    return response.data;
};

/**
 * Accept an application
 */
export const acceptApplication = async (applicationId) => {
    const response = await api.put(`/applications/${applicationId}/accept`);
    return response.data;
};

/**
 * Reject an application
 */
export const rejectApplication = async (applicationId) => {
    const response = await api.put(`/applications/${applicationId}/reject`);
    return response.data;
};
