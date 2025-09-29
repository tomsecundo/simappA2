const express = require('express');
const router = express.Router();
const { 
    createReport, 
    getAllReports,
    getReportById,
    updateReport,
    deleteReport
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for submitting applications
router.post('/report', createReport);

// Protected routes for managing applications
router.get('/', protect, adminOnly, getAllReports);
router.get('/:id', protect, adminOnly, getReportById);
router.delete('/:id', protect, deleteReport);
router.patch('/:id/status', protect, updateReport);

module.exports = router;