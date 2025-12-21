// ============================================
// Cloudinary Configuration
// ============================================
// This file configures Cloudinary for file uploads (resumes, docs).
// File URLs are returned after upload to store in MongoDB.

const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary with credentials from environment variables
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
