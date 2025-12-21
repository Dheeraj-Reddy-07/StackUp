// ============================================
// Team Model
// ============================================
// Represents an accepted team for an opening.
// Contains the team owner and accepted members.

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    // Reference to the related opening
    opening: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opening',
        required: true
    },

    // Team owner (opening creator)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Array of accepted team members
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Team creation timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Instance Methods
// ============================================

/**
 * Check if a user is a member of this team
 * @param {ObjectId} userId - User ID to check
 * @returns {boolean} - True if user is owner or member
 */
teamSchema.methods.isMember = function (userId) {
    const userIdStr = userId.toString();
    // Handle both populated and non-populated owner
    const ownerId = this.owner._id ? this.owner._id.toString() : this.owner.toString();
    
    // Check if user is owner
    if (ownerId === userIdStr) {
        return true;
    }
    
    // Check if user is in members array (handle both populated and non-populated)
    return this.members.some(member => {
        const memberId = member._id ? member._id.toString() : member.toString();
        return memberId === userIdStr;
    });
};

// ============================================
// Indexes
// ============================================
teamSchema.index({ opening: 1 }, { unique: true });
teamSchema.index({ owner: 1 });
teamSchema.index({ members: 1 });

module.exports = mongoose.model('Team', teamSchema);
