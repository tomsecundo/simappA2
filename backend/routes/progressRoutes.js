const express = require('express');
const router = express.Router();
const { 
    getAllProgress,
    createProgress, 
    getProgressByApplicationId,
    getProgressByMentorEmail,
    updatePhase,
    updateProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const roleProxy = require('../middleware/roleProxy');

// Public route for posting progress
router.get('/', getAllProgress);
router.post('/new', createProgress);
router.get('/mentor/:id', getProgressByMentorEmail);
router.put('/:applicationId/update-phase', updatePhase);

// Protected routes for managing applications
router.get('/:id', getProgressByApplicationId);
router.patch('/:id/status', protect, updateProgress);

module.exports = router;