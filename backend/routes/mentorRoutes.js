const express = require('express');
const router = express.Router();

const MentorController = require('../controllers/mentorController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

// Mentor routes
router.get('/profile', protect, hasRole(UserRole.MENTOR), MentorController.getProfile);

// Mentor management
router.post('/register', MentorController.create);
router.get('/', protect, hasRole(UserRole.ADMIN), MentorController.getAll);
router.get('/:id', protect, MentorController.getById);
router.post('/:id/add-program', protect, hasRole(UserRole.ADMIN, UserRole.MENTOR), MentorController.addProgram);
router.post('/:id/remove-program', protect, hasRole(UserRole.ADMIN, UserRole.MENTOR), MentorController.removeProgram);

module.exports = router;
