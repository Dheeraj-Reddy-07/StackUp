// ============================================
// Opening Controller
// ============================================
// CRUD operations for project openings

const Opening = require('../models/Opening');
const Team = require('../models/Team');

// ============================================
// @desc    Get all openings (with filters)
// @route   GET /api/openings
// @access  Public
// ============================================
exports.getOpenings = async (req, res, next) => {
    try {
        const { projectType, skills, status, search } = req.query;

        // Build query
        const query = {};

        // Filter by project type
        if (projectType) {
            query.projectType = projectType;
        }

        // Filter by status (default to open)
        query.status = status || 'open';

        // Filter by required skills (match any)
        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            query.requiredSkills = { $in: skillsArray };
        }

        // Search in title, description, and required skills
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { requiredSkills: { $regex: search, $options: 'i' } }
            ];
        }

        const openings = await Opening.find(query)
            .populate('creator', 'name email college')
            .sort({ createdAt: -1 });

        // Get all teams to check if they're full
        const openingsWithTeams = await Promise.all(
            openings.map(async (opening) => {
                const team = await Team.findOne({ opening: opening._id });
                return { opening, team };
            })
        );

        // Filter out full teams
        const availableOpenings = openingsWithTeams
            .filter(({ opening, team }) => {
                if (!team) return true; // No team yet, still available
                const currentSize = team.members.length + 1; // +1 for owner
                return currentSize < opening.totalSlots;
            })
            .map(({ opening }) => opening);

        res.status(200).json({
            success: true,
            count: availableOpenings.length,
            data: availableOpenings
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get single opening
// @route   GET /api/openings/:id
// @access  Public
// ============================================
exports.getOpening = async (req, res, next) => {
    try {
        const opening = await Opening.findById(req.params.id)
            .populate('creator', 'name email college skills bio');

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        res.status(200).json({
            success: true,
            data: opening
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Create new opening
// @route   POST /api/openings
// @access  Private
// ============================================
exports.createOpening = async (req, res, next) => {
    try {
        const { title, description, projectType, requiredSkills, totalSlots } = req.body;

        // Create opening with current user as creator
        const opening = await Opening.create({
            title,
            description,
            projectType,
            requiredSkills: requiredSkills || [],
            totalSlots,
            creator: req.user.id
        });

        // Create team for this opening (owner is automatically added)
        await Team.create({
            opening: opening._id,
            owner: req.user.id,
            members: []
        });

        // Populate creator info before sending response
        await opening.populate('creator', 'name email college');

        res.status(201).json({
            success: true,
            data: opening
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Update opening
// @route   PUT /api/openings/:id
// @access  Private (owner only)
// ============================================
exports.updateOpening = async (req, res, next) => {
    try {
        let opening = await Opening.findById(req.params.id);

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Check ownership
        if (opening.creator.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this opening'
            });
        }

        // Fields that can be updated
        const { title, description, projectType, requiredSkills, totalSlots, status } = req.body;

        const fieldsToUpdate = {};
        if (title) fieldsToUpdate.title = title;
        if (description) fieldsToUpdate.description = description;
        if (projectType) fieldsToUpdate.projectType = projectType;
        if (requiredSkills) fieldsToUpdate.requiredSkills = requiredSkills;
        if (totalSlots) fieldsToUpdate.totalSlots = totalSlots;
        if (status) fieldsToUpdate.status = status;

        opening = await Opening.findByIdAndUpdate(
            req.params.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        ).populate('creator', 'name email college');

        res.status(200).json({
            success: true,
            data: opening
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Delete opening
// @route   DELETE /api/openings/:id
// @access  Private (owner only)
// ============================================
exports.deleteOpening = async (req, res, next) => {
    try {
        const opening = await Opening.findById(req.params.id);

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Check ownership
        if (opening.creator.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this opening'
            });
        }

        await opening.deleteOne();

        // Also delete associated team
        await Team.deleteOne({ opening: req.params.id });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get user's own openings
// @route   GET /api/openings/my
// @access  Private
// ============================================
exports.getMyOpenings = async (req, res, next) => {
    try {
        const openings = await Opening.find({ creator: req.user.id })
            .populate('creator', 'name email college')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: openings.length,
            data: openings
        });
    } catch (error) {
        next(error);
    }
};
