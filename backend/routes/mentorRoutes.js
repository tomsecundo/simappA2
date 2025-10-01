const express = require('express');
const router = express.Router();
const MentorController = require('../controllers/mentorController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

// Mentor routes
router.get('/me', MentorController.getProfile);
router.post('/register', MentorController.create);
router.get('/', protect, MentorController.getAll);
router.get('/:id', protect, MentorController.getById);
router.post('/:id/add-program', protect, MentorController.addProgram);
router.post('/:id/remove-program', protect, MentorController.removeProgram);

module.exports = router;
