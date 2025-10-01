const express = require('express');
const router = express.Router();
const { 
    getAllProgress,
    createProgress, 
    getProgressById,
    updateProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

// Public route for posting progress
router.get('/', getAllProgress);
router.post('/new', createProgress);

// Protected routes for managing applications
router.get('/:id', protect, getProgressById);
router.patch('/:id/status', protect, updateProgress);

module.exports = router;