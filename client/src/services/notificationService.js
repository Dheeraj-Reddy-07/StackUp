// ============================================
// Notification Service
// ============================================
// API calls for notifications

import api from './api';

/**
 * Get user's notifications
 */
export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
};