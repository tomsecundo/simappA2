const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');
const { getProfile } = require('../controllers/authController');

router.get('/profile', protect, getProfile);
// router.put('/me', protect, updateUserProfile);
// router.get('/', protect, UserController.getAllUsers);
// router.get('/:id', protect, UserController.getUserById);

module.exports = router;