// ============================================
// User Model
// ============================================
// Represents registered users on StackUp.
// Contains authentication data and profile information.

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // User's full name
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide your name' },
            len: { args: [1, 50], msg: 'Name cannot exceed 50 characters' }
        }
    },

    // Email address (used for login)
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'Please provide your email' },
            isEmail: { msg: 'Please provide a valid email' }
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase().trim());
        }
    },

    // Hashed password
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a password' },
            len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
        }
    },

    // College/University name
    college: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    // Array of skill tags (stored as JSONB in PostgreSQL)
    skills: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
    },

    // Short bio/description
    bio: {
        type: DataTypes.STRING(500),
        allowNull: true
    },

    // URL to uploaded resume (local file path)
    resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['email'] }
    ],

    // Hooks - run before/after certain operations
    hooks: {
        // Hash password before creating new user
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },

        // Hash password before updating if it was modified
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// ============================================
// Instance Methods
// ============================================

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {boolean} - True if passwords match
 */
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token for authentication
 * @returns {string} - Signed JWT token
 */
User.prototype.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

module.exports = User;
