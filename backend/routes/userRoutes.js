const express = require('express');
const router = express.Router();

const { UserController, listStartups } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');
const roleProxy = require('../middleware/roleProxy');

router.get('/profile', protect, UserController.getProfile.bind(UserController));
router.put('/profile', protect, UserController.updateUserProfile.bind(UserController));
router.put('/change-password', protect, UserController.changePassword.bind(UserController));
router.get('/startups', protect, listStartups);

router.get('/', protect, UserController.getAllUsers.bind(UserController));
router.get('/:id', protect, UserController.getUserById.bind(UserController));

// Update user (admin-controlled)
router.put('/:id', protect, roleProxy(UserRole.ADMIN), UserController.updateUserByAdmin.bind(UserController));

// Delete user (admin only)
router.delete('/:id', protect, roleProxy(UserRole.ADMIN), UserController.deleteUser.bind(UserController));

module.exports = router;
