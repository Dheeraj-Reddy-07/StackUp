// ============================================
// Upload Routes
// ============================================
// Routes for file uploads to MongoDB

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, getFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow PDFs and images
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
        }
    }
});

// Public route for file retrieval (must come before POST to avoid conflicts)
router.get('/:id', getFile);

// Protected route for upload
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
