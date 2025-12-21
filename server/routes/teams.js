// ============================================
// Team Routes
// ============================================
// Routes for team operations

const express = require('express');
const router = express.Router();
const {
    getMyTeams,
    getTeam,
    getTeamByOpening
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/my', getMyTeams);
router.get('/opening/:openingId', getTeamByOpening);
router.get('/:id', getTeam);

module.exports = router;
