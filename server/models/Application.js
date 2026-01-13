// ============================================
// Application Model
// ============================================
// Represents an application to join an opening.
// Contains applicant's message and optional resume.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Reference to the opening being applied to (foreign key)
    openingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'openings',
            key: 'id'
        }
    },

    // User who submitted the application (foreign key)
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    // Application message/cover letter
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a message' },
            len: { args: [1, 1000], msg: 'Message cannot exceed 1000 characters' }
        }
    },

    // Optional resume URL (local file path)
    resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Application status
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    tableName: 'applications',
    timestamps: true,
    indexes: [
        { fields: ['openingId'] },
        { fields: ['applicantId'] },
        { fields: ['status'] },
        // Compound unique index to prevent duplicate applications
        { unique: true, fields: ['openingId', 'applicantId'] }
    ]
});

module.exports = Application;
