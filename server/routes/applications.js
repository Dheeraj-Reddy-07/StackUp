// ============================================
// Application Routes
// ============================================
// Routes for managing applications to openings

const express = require('express');
const router = express.Router();
const {
    createApplication,
    getMyApplications,
    getOpeningApplications,
    acceptApplication,
    rejectApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createApplication);
router.get('/my', getMyApplications);
router.get('/opening/:openingId', getOpeningApplications);
router.put('/:id/accept', acceptApplication);
router.put('/:id/reject', rejectApplication);

module.exports = router;
