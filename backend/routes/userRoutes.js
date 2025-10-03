const express = require('express');
const router = express.Router();

const { UserController, listStartups } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// ---------- Public/Protected Endpoints ---------- //
router.get('/profile', protect, UserController.getProfile.bind(UserController));
router.put('/profile', protect, UserController.updateUserProfile.bind(UserController));
router.put('/change-password', protect, UserController.changePassword.bind(UserController));
router.get('/startups', protect, listStartups);

// ---------- Strategy-driven Endpoints ---------- //
router.get('/', protect, UserController.getAllUsers.bind(UserController));
router.get('/:id', protect, UserController.getUserById.bind(UserController));

// Update user (admin or strategy-controlled)
router.put('/:id', protect, UserController.updateUserByAdmin.bind(UserController));

// Delete user (admin only for now)
router.delete('/:id', protect, UserController.deleteUser.bind(UserController));

module.exports = router;
