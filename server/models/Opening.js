// ============================================
// Opening Model
// ============================================
// Represents a project/hackathon/study group opening.
// Users create openings to find team members.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Opening = sequelize.define('Opening', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Title of the opening
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a title' },
            len: { args: [1, 100], msg: 'Title cannot exceed 100 characters' }
        }
    },

    // Detailed description of the project/opportunity
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a description' },
            len: { args: [1, 2000], msg: 'Description cannot exceed 2000 characters' }
        }
    },

    // Type of project/opportunity
    projectType: {
        type: DataTypes.ENUM('hackathon', 'project', 'startup', 'study'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please specify project type' },
            isIn: {
                args: [['hackathon', 'project', 'startup', 'study']],
                msg: 'Project type must be hackathon, project, startup, or study'
            }
        }
    },

    // Skills required for this opening (stored as JSONB array)
    requiredSkills: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
    },

    // Total number of team slots available
    totalSlots: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please specify number of slots' },
            min: { args: [1], msg: 'At least 1 slot required' },
            max: { args: [20], msg: 'Maximum 20 slots allowed' }
        }
    },

    // Number of slots already filled
    filledSlots: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    // User who created this opening (foreign key)
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    // Opening status
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        allowNull: false,
        defaultValue: 'open'
    }
}, {
    tableName: 'openings',
    timestamps: true,
    indexes: [
        { fields: ['creatorId'] },
        { fields: ['projectType'] },
        { fields: ['status'] },
        { fields: ['createdAt'] }
    ]
});

// ============================================
// Virtual Fields
// ============================================
Opening.prototype.getAvailableSlots = function () {
    return this.totalSlots - this.filledSlots;
};

module.exports = Opening;
