const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateUserProfile);
router.put('/change-password', protect, UserController.changePassword);

// Admin-only
router.get('/', protect, hasRole(UserRole.ADMIN), UserController.getAllUsers);
router.get('/:id', protect, hasRole(UserRole.ADMIN), UserController.getUserById);
router.delete('/:id', protect, hasRole(UserRole.ADMIN), UserController.deleteUser);

module.exports = router;