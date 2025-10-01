const express = require('express');
const router = express.Router();
const { 
    createProgress, 
    getProgressById,
    updateReport
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for submitting applications
router.post('/new', createProgress);

// Protected routes for managing applications
router.get('/:id', protect, getProgressById);
router.patch('/:id/status', protect, updateReport);

module.exports = router;