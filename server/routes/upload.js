// ============================================
// File Upload Routes
// ============================================
// Routes for file uploads to local storage

const express = require('express');
const router = express.Router();
const { upload, uploadFile, getFile, deleteFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Public route for file retrieval/download
router.get('/:filename', getFile);

// Protected route for file upload
router.post('/upload', protect, upload.single('file'), uploadFile);

// Protected route for file deletion
router.delete('/:filename', protect, deleteFile);

module.exports = router;
