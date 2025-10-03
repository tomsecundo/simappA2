const express = require('express');
const router = express.Router();

const MentorController = require('../controllers/mentorController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');
const roleProxy = require('../middleware/roleProxy');

// Any routes
router.post('/register', MentorController.create);

// Mentor routes
router.get('/profile', protect, roleProxy(UserRole.MENTOR), MentorController.getProfile);
router.put('/profile', protect, roleProxy(UserRole.MENTOR), MentorController.updateProfile);
router.post('/enroll', protect, roleProxy(UserRole.MENTOR), MentorController.enrollInProgram);
router.post('/leave', protect, roleProxy(UserRole.MENTOR), MentorController.leaveProgram);

// Admin, Mentor routes
router.get('/', protect, roleProxy(UserRole.ADMIN, UserRole.MENTOR), MentorController.getAll);
router.get('/:id', protect, MentorController.getById);

// Admin routes
router.put('/:id', protect, roleProxy(UserRole.ADMIN), MentorController.updateMentorByAdmin);
router.delete('/:id', protect, roleProxy(UserRole.ADMIN), MentorController.deleteMentor);
router.post('/:id/add-program', protect, roleProxy(UserRole.ADMIN), MentorController.addProgram);
router.post('/:id/remove-program', protect, roleProxy(UserRole.ADMIN), MentorController.removeProgram);

module.exports = router;
