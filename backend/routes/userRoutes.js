const express = require('express');
const router = express.Router();

const { UserController, listStartups } = require('../controllers/userController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

//List of startups
router.get('/startups', protect, listStartups);

router.get('/profile', protect, UserController.getProfile);
// update current user profile
router.put('/profile', protect, UserController.updateUserProfile);
router.put('/change-password', protect, UserController.changePassword);

// Admin-only
router.get('/', protect, hasRole(UserRole.ADMIN), UserController.getAllUsers);
router.get('/:id', protect, hasRole(UserRole.ADMIN), UserController.getUserById);
// Update user by Admin
router.put('/:id', protect, hasRole(UserRole.ADMIN), UserController.updateUserByAdmin);

router.delete('/:id', protect, hasRole(UserRole.ADMIN), UserController.deleteUser);

module.exports = router;