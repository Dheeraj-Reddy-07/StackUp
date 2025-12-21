// ============================================
// Message Controller
// ============================================
// Handle team chat messages

const Message = require('../models/Message');
const Team = require('../models/Team');

// ============================================
// @desc    Get messages for a team
// @route   GET /api/messages/:teamId
// @access  Private (team members only)
// ============================================
exports.getMessages = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.teamId);

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
        const messages = await Message.find({ team: req.params.teamId })
            .populate('sender', 'name email')
            .sort({ createdAt: 1 })
            .limit(100); // Limit to last 100 messages

        // Mark messages as read by current user when fetching
        const unreadMessages = await Message.find({
            team: req.params.teamId,
            sender: { $ne: req.user.id }, // Not sent by current user
            readBy: { $ne: req.user.id } // Not already read by current user
        });

        // Mark as read
        for (const msg of unreadMessages) {
            if (!msg.readBy.includes(req.user.id)) {
                msg.readBy.push(req.user.id);
                await msg.save();
            }
        }

        // Re-fetch messages with updated readBy
        const updatedMessages = await Message.find({ team: req.params.teamId })
            .populate('sender', 'name email')
            .populate('readBy', 'name')
            .sort({ createdAt: 1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: updatedMessages.length,
            data: updatedMessages
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
        const team = await Team.findById(req.params.teamId);

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
            team: req.params.teamId,
            sender: req.user.id,
            content
        });

        // Populate sender info
        await message.populate('sender', 'name email');

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
        const teams = await Team.find({
            $or: [
                { owner: userId },
                { members: userId }
            ]
        }).select('_id');

        const teamIds = teams.map(t => t._id);

        // Get unread counts and last messages for each team
        const chatStats = await Promise.all(teamIds.map(async (teamId) => {
            // Get unread message count
            const unreadCount = await Message.countDocuments({
                team: teamId,
                sender: { $ne: userId }, // Not sent by current user  
                readBy: { $ne: userId } // Not already read by current user
            });

            // Get last message
            const lastMessage = await Message.findOne({ team: teamId })
                .sort({ createdAt: -1 })
                .select('createdAt');

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
