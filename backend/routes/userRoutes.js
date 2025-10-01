const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');
// const { getProfile } = require('../controllers/authController');

router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.getProfile);

// Admin-only
router.get('/', protect, hasRole(UserRole.ADMIN), UserController.getAllUsers);
router.get('/:id', protect, hasRole(UserRole.ADMIN), UserController.getUserById);

module.exports = router;