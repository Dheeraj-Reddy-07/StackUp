// ============================================
// User Model
// ============================================
// Represents registered users on StackUp.
// Contains authentication data and profile information.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // User's full name
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    // Email address (used for login)
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },

    // Hashed password
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries by default
    },

    // College/University name
    college: {
        type: String,
        trim: true,
        maxlength: [100, 'College name cannot exceed 100 characters']
    },

    // Array of skill tags
    skills: [{
        type: String,
        trim: true
    }],

    // Short bio/description
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },

    // URL to uploaded resume (Cloudinary)
    resumeUrl: {
        type: String
    },

    // Account creation timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Password Hashing Middleware
// ============================================
// Hash password before saving to database
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// Instance Methods
// ============================================

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token for authentication
 * @returns {string} - Signed JWT token
 */
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

module.exports = mongoose.model('User', userSchema);
