const express = require('express');
const router = express.Router();
const { 
    createAssignment, 
    getAllAssignments,
    getAssignmentById,
    getAssignmentByApplicationId,
    getAssignmentByStatus,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const roleProxy = require('../middleware/roleProxy');

const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const {id}= req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message:'Invalid id'});
    }
    next ();
};

// Protected route for submitting assignments
router.post('/', protect, createAssignment);

// Protected routes for managing assignments
router.get('/', protect, getAllAssignments);
router.get('/status/:status', protect, getAssignmentByStatus);
router.get('/application/:id', protect, getAssignmentByApplicationId);
router.get('/:id', protect, validateObjectId, getAssignmentById);
router.delete('/:id', protect, validateObjectId, deleteAssignment);
router.put('/:id', protect, validateObjectId, updateAssignment);

module.exports = router;