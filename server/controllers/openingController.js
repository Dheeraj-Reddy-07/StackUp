// ============================================
// Opening Controller
// ============================================
// CRUD operations for project openings

const { Opening, Team, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// @desc    Get all openings (with filters)
// @route   GET /api/openings
// @access  Public
// ============================================
exports.getOpenings = async (req, res, next) => {
    try {
        const { projectType, skills, status, search } = req.query;

        // Build where clause
        const where = {};

        // Filter by project type
        if (projectType) {
            where.projectType = projectType;
        }

        // Filter by status (default to open)
        where.status = status || 'open';

        // Search in title or description
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const openings = await Opening.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email', 'college']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Filter by skills if provided (skills are stored as JSONB)
        let filteredOpenings = openings;
        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            filteredOpenings = openings.filter(opening => {
                if (!opening.requiredSkills || !Array.isArray(opening.requiredSkills)) return false;
                return skillsArray.some(skill => opening.requiredSkills.includes(skill));
            });
        }

        // Check team sizes to filter out full openings
        const availableOpenings = [];
        for (const opening of filteredOpenings) {
            const team = await Team.findOne({ where: { openingId: opening.id } });
            if (!team) {
                availableOpenings.push(opening);
                continue;
            }
            const currentSize = (Array.isArray(team.members) ? team.members.length : 0) + 1; // +1 for owner
            if (currentSize < opening.totalSlots) {
                availableOpenings.push(opening);
            }
        }

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
        const opening = await Opening.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email', 'college', 'skills', 'bio']
                }
            ]
        });

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
            creatorId: req.user.id
        });

        // Create team for this opening (owner is automatically added)
        await Team.create({
            openingId: opening.id,
            ownerId: req.user.id,
            members: []
        });

        // Reload with creator info
        await opening.reload({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email', 'college']
                }
            ]
        });

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
        const opening = await Opening.findByPk(req.params.id);

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Check ownership
        if (opening.creatorId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this opening'
            });
        }

        // Fields that can be updated
        const { title, description, projectType, requiredSkills, totalSlots, status } = req.body;

        if (title !== undefined) opening.title = title;
        if (description !== undefined) opening.description = description;
        if (projectType !== undefined) opening.projectType = projectType;
        if (requiredSkills !== undefined) opening.requiredSkills = requiredSkills;
        if (totalSlots !== undefined) opening.totalSlots = totalSlots;
        if (status !== undefined) opening.status = status;

        await opening.save();

        // Reload with creator info
        await opening.reload({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email', 'college']
                }
            ]
        });

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
        const opening = await Opening.findByPk(req.params.id);

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Check ownership
        if (opening.creatorId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this opening'
            });
        }

        await opening.destroy();

        // Also delete associated team
        await Team.destroy({ where: { openingId: req.params.id } });

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
        const openings = await Opening.findAll({
            where: { creatorId: req.user.id },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email', 'college']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: openings.length,
            data: openings
        });
    } catch (error) {
        next(error);
    }
};
