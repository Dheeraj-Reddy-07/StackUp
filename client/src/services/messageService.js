// ============================================
// Message Service
// ============================================
// API calls for chat messages

import api from './api';

/**
 * Get messages for a team
 */
export const getMessages = async (teamId) => {
    const response = await api.get(`/messages/${teamId}`);
    return response.data;
};

/**
 * Send a message to team chat (REST fallback)
 */
export const sendMessage = async (teamId, content) => {
    const response = await api.post(`/messages/${teamId}`, { content });
    return response.data;
};

/**
 * Get chat statistics (unread counts, last message times)
 */
export const getChatStats = async () => {
    const response = await api.get('/messages/stats');
    return response.data;
};
