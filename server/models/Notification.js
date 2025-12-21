// ============================================
// Notification Model
// ============================================
// In-app notifications for user actions.
// Supports various notification types.

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // User receiving the notification
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Type of notification
    type: {
        type: String,
        required: true,
        enum: [
            'application_received',  // When someone applies to your opening
            'application_accepted',  // When your application is accepted
            'application_rejected',  // When your application is rejected
            'team_message'           // New message in team chat
        ]
    },

    // Human-readable notification message
    message: {
        type: String,
        required: true,
        maxlength: [500, 'Notification message cannot exceed 500 characters']
    },

    // Read status
    read: {
        type: Boolean,
        default: false
    },

    // Related entity ID (opening, application, or team)
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },

    // What the relatedId refers to
    relatedModel: {
        type: String,
        enum: ['Opening', 'Application', 'Team']
    },

    // Notification timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Indexes for efficient queries
// ============================================
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
