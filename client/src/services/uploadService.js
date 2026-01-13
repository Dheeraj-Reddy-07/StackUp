// ============================================
// Upload Service
// ============================================
// File upload to Cloudinary via backend

import api from './api';

/**
 * Upload a file (resume/document)
 * @param {File} file - File object to upload
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
};
