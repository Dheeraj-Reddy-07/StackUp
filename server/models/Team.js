// ============================================
// Team Model
// ============================================
// Represents an accepted team for an opening.
// Contains the team owner and accepted members.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Reference to the related opening (foreign key)
    openingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // Each opening can have only one team
        references: {
            model: 'openings',
            key: 'id'
        }
    },

    // Team owner (opening creator) - foreign key
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    // Array of accepted team members (stored as JSONB array of user IDs)
    members: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: 'teams',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['openingId'] },
        { fields: ['ownerId'] }
    ]
});

// ============================================
// Instance Methods
// ============================================

/**
 * Check if a user is a member of this team
 * @param {number} userId - User ID to check
 * @returns {boolean} - True if user is owner or member
 */
Team.prototype.isMember = function (userId) {
    const userIdNum = parseInt(userId);

    // Check if user is owner
    if (this.ownerId === userIdNum) {
        return true;
    }

    // Check if user is in members array
    if (Array.isArray(this.members)) {
        return this.members.includes(userIdNum);
    }

    return false;
};

module.exports = Team;
