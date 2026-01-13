// ============================================
// Upload Controller
// ============================================
// Handles file uploads to local storage

const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Configure multer for local disk storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');

        // Create uploads directory if it doesn't exist
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-userid-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const userId = req.user?.id || 'anonymous';
        const filename = `${uniqueSuffix}-${userId}-${file.originalname}`;
        cb(null, filename);
    }
});

// File filter - only allow PDFs and common document formats
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOC/DOCX files are allowed.'), false);
    }
};

// Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * Upload a single file
 * @route POST /api/files/upload
 * @access Private
 */
const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Generate file URL
        const fileUrl = `/api/files/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: fileUrl,
                path: req.file.path
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get/download a file
 * @route GET /api/files/:filename
 * @access Public (could make private if needed)
 */
const getFile = async (req, res, next) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Send file
        res.sendFile(filePath);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a file
 * @route DELETE /api/files/:filename
 * @access Private
 */
const deleteFile = async (req, res, next) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);

            res.status(200).json({
                success: true,
                message: 'File deleted successfully'
            });
        } catch {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    uploadFile,
    getFile,
    deleteFile
};
