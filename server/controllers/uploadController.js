// ============================================
// Upload Controller - MongoDB File Storage
// ============================================
// Store files directly in MongoDB as base64

const File = require('../models/File');

// ============================================
// @desc    Upload file to MongoDB
// @route   POST /api/upload
// @access  Private
// ============================================
exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Convert buffer to base64
        const base64File = req.file.buffer.toString('base64');

        // Create file record in MongoDB
        const file = await File.create({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            size: req.file.size,
            data: base64File,
            uploadedBy: req.user.id
        });

        // Return file ID - frontend will use this to build URL
        res.status(201).json({
            success: true,
            data: {
                fileId: file._id,
                url: `/api/files/${file._id}`, // Local URL to retrieve file
                filename: file.filename,
                contentType: file.contentType,
                size: file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        next(error);
    }
};

// ============================================
// @desc    Get file from MongoDB
// @route   GET /api/files/:id
// @access  Public (files are public once uploaded)
// ============================================
exports.getFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Convert base64 back to buffer
        const fileBuffer = Buffer.from(file.data, 'base64');

        // Set headers for file download/display
        res.set({
            'Content-Type': file.contentType,
            'Content-Length': file.size,
            'Content-Disposition': `inline; filename="${file.filename}"`
        });

        res.send(fileBuffer);
    } catch (error) {
        console.error('File retrieval error:', error);
        next(error);
    }
};
