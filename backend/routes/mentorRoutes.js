const express = require('express');
const router = express.Router();

const MentorController = require('../controllers/mentorController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

// Any routes
router.post('/register', MentorController.create);

// Mentor routes
router.get('/profile', protect, hasRole(UserRole.MENTOR), MentorController.getProfile);
router.put('/profile', protect, hasRole(UserRole.MENTOR), MentorController.updateProfile);
router.put('/change-password', protect, hasRole(UserRole.MENTOR), MentorController.changePassword);
router.post('/enroll', protect, hasRole(UserRole.MENTOR), MentorController.enrollInProgram);
router.post('/leave', protect, hasRole(UserRole.MENTOR), MentorController.leaveProgram);

// Admin, Mentor routes
router.get('/', protect, hasRole(UserRole.ADMIN, UserRole.MENTOR), MentorController.getAll);
router.get('/:id', protect, MentorController.getById);

// Admin routes
router.delete('/:id', protect, hasRole(UserRole.ADMIN), MentorController.deleteMentor);
router.post('/:id/add-program', protect, hasRole(UserRole.ADMIN), MentorController.addProgram);
router.post('/:id/remove-program', protect, hasRole(UserRole.ADMIN), MentorController.removeProgram);

module.exports = router;
