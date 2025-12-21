// ============================================
// Message Model
// ============================================
// Represents a chat message within a team.
// Part of the real-time chat system using Socket.IO.

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Reference to the team this message belongs to
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },

    // User who sent the message
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Message content
    content: {
        type: String,
        required: [true, 'Message cannot be empty'],
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },

    // Array of user IDs who have read this message
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Message timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Indexes for efficient queries
// ============================================
// Index for fetching messages by team, sorted by time
messageSchema.index({ team: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
