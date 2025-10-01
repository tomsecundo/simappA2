const express = require('express');
const router = express.Router();
const { 
    createAssignment, 
    getAllAssignments,
    getAssignmentById,
    getAssignmentByApplicationId,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route for submitting applications
router.post('/assignments', createAssignment);

// Protected routes for managing applications
router.get('/', protect, getAllAssignments);
router.get('/:id', protect, getAssignmentById);
router.get('/:id', protect, getAssignmentByApplicationId);
router.delete('/:id', protect, deleteAssignment);
router.patch('/:id/status', protect, updateAssignment);

module.exports = router;