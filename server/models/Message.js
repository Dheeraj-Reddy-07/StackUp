// ============================================
// Message Model
// ============================================
// Represents a chat message within a team.
// Part of the real-time chat system using Socket.IO.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Reference to the team this message belongs to (foreign key)
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'teams',
            key: 'id'
        }
    },

    // User who sent the message (foreign key)
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    // Message content
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Message cannot be empty' },
            len: { args: [1, 2000], msg: 'Message cannot exceed 2000 characters' }
        }
    },

    // Array of user IDs who have read this message (stored as JSONB)
    readBy: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: 'messages',
    timestamps: true,
    updatedAt: false,  // Messages don't need updatedAt
    indexes: [
        // Compound index for fetching messages by team, sorted by time
        { fields: ['teamId', 'createdAt'] }
    ]
});

module.exports = Message;
