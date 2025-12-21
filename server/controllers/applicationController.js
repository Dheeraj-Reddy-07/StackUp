// ============================================
// Application Controller
// ============================================
// Handle applications to join openings

const Application = require('../models/Application');
const Opening = require('../models/Opening');
const Team = require('../models/Team');
const Notification = require('../models/Notification');

// ============================================
// @desc    Submit application to an opening
// @route   POST /api/applications
// @access  Private
// ============================================
exports.createApplication = async (req, res, next) => {
    try {
        const { openingId, message, resumeUrl } = req.body;

        // Check if opening exists
        const opening = await Opening.findById(openingId).populate('creator', 'name');

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
        if (opening.creator._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot apply to your own opening'
            });
        }

        // Check for duplicate application
        const existingApplication = await Application.findOne({
            opening: openingId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this opening'
            });
        }

        // Create application
        const application = await Application.create({
            opening: openingId,
            applicant: req.user.id,
            message,
            resumeUrl
        });

        // Create notification for opening creator
        await Notification.create({
            user: opening.creator._id,
            type: 'application_received',
            message: `${req.user.name} applied to "${opening.title}"`,
            relatedId: opening._id, // Use opening ID so we can navigate to opening details page
            relatedModel: 'Opening'
        });

        // Populate applicant info
        await application.populate('applicant', 'name email college skills');
        await application.populate('opening', 'title');

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
        const applications = await Application.find({ applicant: req.user.id })
            .populate('opening', 'title projectType status creator')
            .populate({
                path: 'opening',
                populate: {
                    path: 'creator',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 });

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
        const opening = await Opening.findById(req.params.openingId);

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found'
            });
        }

        // Only owner can view applications
        if (opening.creator.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these applications'
            });
        }

        const applications = await Application.find({ opening: req.params.openingId })
            .populate('applicant', 'name email college skills bio resumeUrl')
            .sort({ createdAt: -1 });

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
    try {
        const application = await Application.findById(req.params.id)
            .populate('opening')
            .populate('applicant', 'name');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify ownership of opening
        if (application.opening.creator.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to accept this application'
            });
        }

        // Check if already processed
        if (application.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Application already ${application.status}`
            });
        }

        // Check if slots available
        if (application.opening.filledSlots >= application.opening.totalSlots) {
            return res.status(400).json({
                success: false,
                message: 'No more slots available'
            });
        }

        // Update application status
        application.status = 'accepted';
        await application.save();

        // Update opening filled slots
        await Opening.findByIdAndUpdate(application.opening._id, {
            $inc: { filledSlots: 1 }
        });

        // Create team or add member to existing team
        let team = await Team.findOne({ opening: application.opening._id });

        if (!team) {
            // Create new team with opening owner and first accepted member
            team = await Team.create({
                opening: application.opening._id,
                owner: application.opening.creator,
                members: [application.applicant._id]
            });
        } else {
            // Add member to existing team
            await Team.findByIdAndUpdate(team._id, {
                $addToSet: { members: application.applicant._id }
            });
        }

        // Create notification for applicant
        await Notification.create({
            user: application.applicant._id,
            type: 'application_accepted',
            message: `Your application for "${application.opening.title}" was accepted!`,
            relatedId: application.opening._id,
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

// ============================================
// @desc    Reject an application
// @route   PUT /api/applications/:id/reject
// @access  Private (opening owner only)
// ============================================
exports.rejectApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('opening')
            .populate('applicant', 'name');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify ownership of opening
        if (application.opening.creator.toString() !== req.user.id) {
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
            user: application.applicant._id,
            type: 'application_rejected',
            message: `Your application for "${application.opening.title}" was not accepted`,
            relatedId: application.opening._id,
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
