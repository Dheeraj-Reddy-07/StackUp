// ============================================
// Opening Model
// ============================================
// Represents a project/hackathon/study group opening.
// Users create openings to find team members.

const mongoose = require('mongoose');

const openingSchema = new mongoose.Schema({
    // Title of the opening
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },

    // Detailed description of the project/opportunity
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },

    // Type of project/opportunity
    projectType: {
        type: String,
        required: [true, 'Please specify project type'],
        enum: {
            values: ['hackathon', 'project', 'startup', 'study'],
            message: 'Project type must be hackathon, project, startup, or study'
        }
    },

    // Skills required for this opening
    requiredSkills: [{
        type: String,
        trim: true
    }],

    // Total number of team slots available
    totalSlots: {
        type: Number,
        required: [true, 'Please specify number of slots'],
        min: [1, 'At least 1 slot required'],
        max: [20, 'Maximum 20 slots allowed']
    },

    // Number of slots already filled
    filledSlots: {
        type: Number,
        default: 0
    },

    // User who created this opening
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Opening status
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },

    // Creation timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Virtual for available slots
// ============================================
openingSchema.virtual('availableSlots').get(function () {
    return this.totalSlots - this.filledSlots;
});

// Ensure virtuals are included in JSON output
openingSchema.set('toJSON', { virtuals: true });
openingSchema.set('toObject', { virtuals: true });

// ============================================
// Indexes for faster queries
// ============================================
openingSchema.index({ creator: 1 });
openingSchema.index({ projectType: 1 });
openingSchema.index({ status: 1 });
openingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Opening', openingSchema);
