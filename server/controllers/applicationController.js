// ============================================
// Application Controller
// ============================================
// Handle applications to join openings

const { Application, Opening, Team, Notification, User } = require('../models');
const { sequelize } = require('../config/database');

// ============================================
// @desc    Submit application to an opening
// @route   POST /api/applications
// @access  Private
// ============================================
exports.createApplication = async (req, res, next) => {
    try {
        const { openingId, message, resumeUrl } = req.body;

        // Check if opening exists
        const opening = await Opening.findByPk(openingId, {
            include: [{
                model: User,
                as: 'creator',
                attributes: ['id', 'name']
            }]
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Check if opening is still open
        if (opening.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This opening is no longer accepting applications'
            });
        }

        // Check if slots are available
        if (opening.filledSlots >= opening.totalSlots) {
            return res.status(400).json({
                success: false,
                message: 'No slots available for this opening'
            });
        }

        // Prevent self-application
        if (opening.creatorId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot apply to your own opening'
            });
        }

        // Check for duplicate application
        const existingApplication = await Application.findOne({
            where: {
                openingId: openingId,
                applicantId: req.user.id
            }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this opening'
            });
        }

        // Create application
        const application = await Application.create({
            openingId: openingId,
            applicantId: req.user.id,
            message,
            resumeUrl
        });

        // Create notification for opening creator
        await Notification.create({
            userId: opening.creatorId,
            type: 'application_received',
            message: `${req.user.name} applied to "${opening.title}"`,
            relatedId: opening.id,
            relatedModel: 'Opening'
        });

        // Reload with associations
        await application.reload({
            include: [
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'name', 'email', 'college', 'skills']
                },
                {
                    model: Opening,
                    as: 'opening',
                    attributes: ['id', 'title']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get user's own applications
// @route   GET /api/applications/my
// @access  Private
// ============================================
exports.getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.findAll({
            where: { applicantId: req.user.id },
            include: [
                {
                    model: Opening,
                    as: 'opening',
                    attributes: ['id', 'title', 'projectType', 'status'],
                    include: [{
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'name']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Get applications for an opening
// @route   GET /api/applications/opening/:openingId
// @access  Private (opening owner only)
// ============================================
exports.getOpeningApplications = async (req, res, next) => {
    try {
        const opening = await Opening.findByPk(req.params.openingId);

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Only owner can view applications
        if (opening.creatorId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these applications'
            });
        }

        const applications = await Application.findAll({
            where: { openingId: req.params.openingId },
            include: [{
                model: User,
                as: 'applicant',
                attributes: ['id', 'name', 'email', 'college', 'skills', 'bio', 'resumeUrl']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// @desc    Accept an application
// @route   PUT /api/applications/:id/accept
// @access  Private (opening owner only)
// ============================================
exports.acceptApplication = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                {
                    model: Opening,
                    as: 'opening'
                },
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'name']
                }
            ],
            transaction: t
        });

        if (!application) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify ownership of opening
        if (application.opening.creatorId !== req.user.id) {
            await t.rollback();
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this application'
            });
        }

        // Check if already processed
        if (application.status !== 'pending') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: `Application already ${application.status}`
            });
        }

        // Check if slots available
        if (application.opening.filledSlots >= application.opening.totalSlots) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'No more slots available'
            });
        }

        // Update application status
        application.status = 'accepted';
        await application.save({ transaction: t });

        // Update opening filled slots
        application.opening.filledSlots += 1;
        await application.opening.save({ transaction: t });

        // Create team or add member to existing team
        let team = await Team.findOne({
            where: { openingId: application.opening.id },
            transaction: t
        });

        if (!team) {
            // Create new team with opening owner and first accepted member
            team = await Team.create({
                openingId: application.opening.id,
                ownerId: application.opening.creatorId,
                members: [application.applicantId]
            }, { transaction: t });
        } else {
            // Add member to existing team
            const currentMembers = Array.isArray(team.members) ? team.members : [];
            if (!currentMembers.includes(application.applicantId)) {
                team.members = [...currentMembers, application.applicantId];
                await team.save({ transaction: t });
            }
        }

        // Create notification for applicant
        await Notification.create({
            userId: application.applicantId,
            type: 'application_accepted',
            message: `Your application for "${application.opening.title}" was accepted!`,
            relatedId: application.opening.id,
            relatedModel: 'Opening'
        }, { transaction: t });

        await t.commit();

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

// ============================================
// @desc    Reject an application
// @route   PUT /api/applications/:id/reject
// @access  Private (opening owner only)
// ============================================
exports.rejectApplication = async (req, res, next) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                {
                    model: Opening,
                    as: 'opening'
                },
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify ownership of opening
        if (application.opening.creatorId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to reject this application'
            });
        }

        // Check if already processed
        if (application.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Application already ${application.status}`
            });
        }

        // Update application status
        application.status = 'rejected';
        await application.save();

        // Create notification for applicant
        await Notification.create({
            userId: application.applicantId,
            type: 'application_rejected',
            message: `Your application for "${application.opening.title}" was not accepted`,
            relatedId: application.opening.id,
            relatedModel: 'Opening'
        });

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        next(error);
    }
};
