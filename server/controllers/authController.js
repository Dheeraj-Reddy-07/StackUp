// ============================================
// Auth Controller
// ============================================
// Handles user authentication: register, login, profile

const { User } = require('../models');

// ============================================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ============================================
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, college, skills, bio } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            college,
            skills: skills || [],
            bio
        });

        // Generate token and send response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (password is included by default in Sequelize)
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password match
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token and send response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
// ============================================
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// ============================================
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, college, skills, bio, resumeUrl } = req.body;

        // Find user
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (college !== undefined) user.college = college;
        if (skills !== undefined) user.skills = skills;
        if (bio !== undefined) user.bio = bio;
        if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;

        // Save changes (triggers validation)
        await user.save();

        // Remove password from response
        const userData = user.toJSON();
        delete userData.password;

        res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// Helper: Send token response
// ============================================
const sendTokenResponse = (user, statusCode, res) => {
    // Generate token
    const token = user.getSignedJwtToken();

    // Remove password from response
    const userData = user.toJSON();
    delete userData.password;

    res.status(statusCode).json({
        success: true,
        token,
        data: userData
    });
};
