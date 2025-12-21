// ============================================
// Message Routes
// ============================================
// Routes for team chat messages

const express = require('express');
const router = express.Router();
const {
    getMessages,
    sendMessage,
    getChatStats
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/stats', getChatStats);
router.get('/:teamId', getMessages);
router.post('/:teamId', sendMessage);

module.exports = router;
