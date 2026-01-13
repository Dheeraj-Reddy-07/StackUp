// ============================================
// Notification Controller
// ============================================
// Handle user notifications

const { Notification } = require('../models');

// ============================================
// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
// ============================================
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50 // Limit to last 50 notifications
        });

        // Count unread notifications
        const unreadCount = await Notification.count({
            where: {
                userId: req.user.id,
                read: false
            }
        });

        res.status(200).json({
            success: true,
            unreadCount,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
// ============================================
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Verify ownership
        if (notification.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
// ============================================
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.update(
            { read: true },
            {
                where: {
                    userId: req.user.id,
                    read: false
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
// ============================================
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Verify ownership
        if (notification.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await notification.destroy();

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        next(error);
    }
};