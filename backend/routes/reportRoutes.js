const express = require('express');
const router = express.Router();
const { 
    createReport, 
    getAllReports,
    getReportById,
    getReportByApplicationId,
    updateReport,
    deleteReport
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for submitting applications
router.post('/reports', createReport);

// Protected routes for managing applications
router.get('/', protect, getAllReports);
router.get('/:id', protect, getReportById);
router.get('/:id', protect, getReportByApplicationId);
router.delete('/:id', protect, deleteReport);
router.patch('/:id/status', protect, updateReport);

module.exports = router;