
const express = require('express');
const { updateUserProfile, getProfile, getUsers, getUserById, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/:id', protect, getUserById);
router.get('/', protect, getUsers);

router.delete('/:id', protect, deleteUser)

module.exports = router;
