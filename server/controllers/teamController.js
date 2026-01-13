// ============================================
// Team Controller
// ============================================
// Handle team operations and member access

const { Team, Opening, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// @desc    Get user's teams (as owner or member)
// @route   GET /api/teams/my
// @access  Private
// ============================================
exports.getMyTeams = async (req, res, next) => {
    try {
        // Find teams where user is owner OR in members array
        const allTeams = await Team.findAll({
            include: [
                {
                    model: Opening,
                    as: 'opening',
                    attributes: ['id', 'title', 'projectType', 'status']
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email', 'college']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Filter teams where user is member (including owner)
        const myTeams = allTeams.filter(team => team.isMember(req.user.id));

        // Load member details for each team
        const teamsWithMembers = await Promise.all(myTeams.map(async (team) => {
            const memberIds = Array.isArray(team.members) ? team.members : [];
            const members = await User.findAll({
                where: { id: { [Op.in]: memberIds } },
                attributes: ['id', 'name', 'email', 'college', 'skills']
            });
            return {
                ...team.toJSON(),
                membersData: members
            };
        }));

        res.status(200).json({
            success: true,
            count: teamsWithMembers.length,
            data: teamsWithMembers
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Private (team members only)
// ============================================
exports.getTeam = async (req, res, next) => {
    try {
        const team = await Team.findByPk(req.params.id, {
            include: [
                {
                    model: Opening,
                    as: 'opening',
                    attributes: ['id', 'title', 'description', 'projectType', 'status', 'requiredSkills', 'totalSlots', 'filledSlots']
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email', 'college', 'skills', 'bio']
                }
            ]
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if user is a member
        if (!team.isMember(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this team'
            });
        }

        // Load member details
        const memberIds = Array.isArray(team.members) ? team.members : [];
        const members = await User.findAll({
            where: { id: { [Op.in]: memberIds } },
            attributes: ['id', 'name', 'email', 'college', 'skills', 'bio']
        });

        const teamData = {
            ...team.toJSON(),
            membersData: members
        };

        res.status(200).json({
            success: true,
            data: teamData
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get team by opening ID
// @route   GET /api/teams/opening/:openingId
// @access  Private (team members only)
// ============================================
exports.getTeamByOpening = async (req, res, next) => {
    try {
        const team = await Team.findOne({
            where: { openingId: req.params.openingId },
            include: [
                {
                    model: Opening,
                    as: 'opening',
                    attributes: ['id', 'title', 'description', 'projectType', 'status', 'requiredSkills', 'totalSlots', 'filledSlots']
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name', 'email', 'college', 'skills', 'bio']
                }
            ]
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Check if user is a member
        if (!team.isMember(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this team'
            });
        }

        // Load member details
        const memberIds = Array.isArray(team.members) ? team.members : [];
        const members = await User.findAll({
            where: { id: { [Op.in]: memberIds } },
            attributes: ['id', 'name', 'email', 'college', 'skills', 'bio']
        });

        const teamData = {
            ...team.toJSON(),
            membersData: members
        };

        res.status(200).json({
            success: true,
            data: teamData
        });
    } catch (error) {
        next(error);
    }
};
