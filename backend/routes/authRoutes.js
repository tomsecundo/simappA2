const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const roleProxy = require('../middleware/roleProxy');

// Auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;