// ============================================
// Team Controller
// ============================================
// Handle team operations and member access

const Team = require('../models/Team');
const Opening = require('../models/Opening');

// ============================================
// @desc    Get user's teams (as owner or member)
// @route   GET /api/teams/my
// @access  Private
// ============================================
exports.getMyTeams = async (req, res, next) => {
    try {
        const teams = await Team.find({
            $or: [
                { owner: req.user.id },
                { members: req.user.id }
            ]
        })
            .populate('opening', 'title projectType status')
            .populate('owner', 'name email college')
            .populate('members', 'name email college skills')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: teams.length,
            data: teams
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
        const team = await Team.findById(req.params.id)
            .populate('opening', 'title description projectType status requiredSkills totalSlots filledSlots')
            .populate('owner', 'name email college skills bio')
            .populate('members', 'name email college skills bio');

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

        res.status(200).json({
            success: true,
            data: team
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
        const team = await Team.findOne({ opening: req.params.openingId })
            .populate('opening', 'title description projectType status requiredSkills totalSlots filledSlots')
            .populate('owner', 'name email college skills bio')
            .populate('members', 'name email college skills bio');

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

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        next(error);
    }
};
