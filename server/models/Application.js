// ============================================
// Application Model
// ============================================
// Represents an application to join an opening.
// Contains applicant's message and optional resume.

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // Reference to the opening being applied to
    opening: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opening',
        required: true
    },

    // User who submitted the application
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Application message/cover letter
    message: {
        type: String,
        required: [true, 'Please provide a message'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },

    // Optional resume URL (uploaded to Cloudinary)
    resumeUrl: {
        type: String
    },

    // Application status
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },

    // Submission timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Indexes for faster queries
// ============================================
applicationSchema.index({ opening: 1 });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ status: 1 });

// Compound index to prevent duplicate applications
applicationSchema.index({ opening: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
