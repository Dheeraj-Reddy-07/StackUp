// ============================================
// Notification Model
// ============================================
// In-app notifications for user actions.
// Supports various notification types.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // User receiving the notification (foreign key)
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    // Type of notification
    type: {
        type: DataTypes.ENUM(
            'application_received',
            'application_accepted',
            'application_rejected',
            'team_message'
        ),
        allowNull: false
    },

    // Human-readable notification message
    message: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            len: { args: [1, 500], msg: 'Notification message cannot exceed 500 characters' }
        }
    },

    // Read status
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    // Related entity ID (opening, application, or team)
    relatedId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    // What the relatedId refers to
    relatedModel: {
        type: DataTypes.ENUM('Opening', 'Application', 'Team'),
        allowNull: true
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,  // Notifications don't need updatedAt
    indexes: [
        { fields: ['userId', 'read'] },
        { fields: ['userId', 'createdAt'] }
    ]
});

module.exports = Notification;
