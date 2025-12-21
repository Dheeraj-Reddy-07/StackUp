// ============================================
// Opening Routes
// ============================================
// Routes for project openings CRUD

const express = require('express');
const router = express.Router();
const {
    getOpenings,
    getOpening,
    createOpening,
    updateOpening,
    deleteOpening,
    getMyOpenings
} = require('../controllers/openingController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getOpenings);
router.get('/:id', getOpening);

// Protected routes
router.post('/', protect, createOpening);
router.put('/:id', protect, updateOpening);
router.delete('/:id', protect, deleteOpening);
router.get('/user/my', protect, getMyOpenings);

module.exports = router;
