// ============================================
// Message Controller
// ============================================
// Handle team chat messages

const { Message, Team, User } = require('../models');
const { Op } = require('sequelize');

// ============================================
// @desc    Get messages for a team
// @route   GET /api/messages/:teamId
// @access  Private (team members only)
// ============================================
exports.getMessages = async (req, res, next) => {
    try {
        const team = await Team.findByPk(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Verify user is a team member
        if (!team.isMember(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these messages'
            });
        }

        // Get messages with sender info
        const messages = await Message.findAll({
            where: { teamId: req.params.teamId },
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email']
            }],
            order: [['createdAt', 'ASC']],
            limit: 100 // Limit to last 100 messages
        });

        // Mark unread messages as read by current user
        for (const msg of messages) {
            if (msg.senderId !== req.user.id) {
                const readBy = Array.isArray(msg.readBy) ? msg.readBy : [];
                if (!readBy.includes(req.user.id)) {
                    msg.readBy = [...readBy, req.user.id];
                    await msg.save();
                }
            }
        }

        // Re-fetch messages with updated readBy and populate readBy users
        const updatedMessages = await Message.findAll({
            where: { teamId: req.params.teamId },
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email']
            }],
            order: [['createdAt', 'ASC']],
            limit: 100
        });

        // Load readBy user data manually (since JSONB array can't be populated directly)
        const messagesWithReadBy = await Promise.all(updatedMessages.map(async (msg) => {
            const readByIds = Array.isArray(msg.readBy) ? msg.readBy : [];
            const readByUsers = readByIds.length > 0 ? await User.findAll({
                where: { id: { [Op.in]: readByIds } },
                attributes: ['id', 'name']
            }) : [];

            return {
                ...msg.toJSON(),
                readByUsers
            };
        }));

        res.status(200).json({
            success: true,
            count: messagesWithReadBy.length,
            data: messagesWithReadBy
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Send a message to team chat
// @route   POST /api/messages/:teamId
// @access  Private (team members only)
// ============================================
exports.sendMessage = async (req, res, next) => {
    try {
        const { content } = req.body;
        const team = await Team.findByPk(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Verify user is a team member
        if (!team.isMember(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages to this team'
            });
        }

        // Create message
        const message = await Message.create({
            teamId: req.params.teamId,
            senderId: req.user.id,
            content
        });

        // Reload with sender info
        await message.reload({
            include: [{
                model: User,
                as: 'sender',
                attributes: ['id', 'name', 'email']
            }]
        });

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get chat statistics for dashboard
// @route   GET /api/messages/stats
// @access  Private
// ============================================
exports.getChatStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get all teams the user is a member of
        const allTeams = await Team.findAll({
            attributes: ['id']
        });

        const teamIds = allTeams.filter(team => team.isMember(userId)).map(t => t.id);

        // Get unread counts and last messages for each team
        const chatStats = await Promise.all(teamIds.map(async (teamId) => {
            // Count unread messages
            const messages = await Message.findAll({
                where: { teamId },
                attributes: ['id', 'senderId', 'readBy', 'createdAt']
            });

            const unreadCount = messages.filter(msg => {
                if (msg.senderId === userId) return false;
                const readBy = Array.isArray(msg.readBy) ? msg.readBy : [];
                return !readBy.includes(userId);
            }).length;

            // Get last message
            const lastMessage = await Message.findOne({
                where: { teamId },
                order: [['createdAt', 'DESC']],
                attributes: ['createdAt']
            });

            return {
                teamId: teamId.toString(),
                unreadCount,
                lastMessageTime: lastMessage ? lastMessage.createdAt : null
            };
        }));

        res.status(200).json({
            success: true,
            data: chatStats
        });
    } catch (error) {
        next(error);
    }
};
