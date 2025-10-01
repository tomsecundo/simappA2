const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

router.get('/me', protect, UserController.getProfile);
// router.put('/me', protect, updateUserProfile);

router.get('/', protect, UserController.getAllUsers);
router.get('/:id', protect, UserController.getUserById);

module.exports = router;