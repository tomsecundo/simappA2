
const express = require('express');
const { updateUserProfile, getProfile, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, getUsers);

module.exports = router;
