const express = require('express');
const router = express.Router();
const ApplicationController = require("../controllers/applicationController");
const validateApplication = require("../middleware/validators/validateApplication");
const { protect } = require("../middleware/authMiddleware");
const { UserRole } = require('../models/UserModel');
const roleProxy = require('../middleware/roleProxy');

router.get('/program/:programId', protect, ApplicationController.getByProgramId);

// Startup: can submit application
// router.post('/', protect, hasRole(UserRole.STARTUP), validateApplication, ApplicationController.create);
router.post('/', protect, validateApplication, ApplicationController.create);

// Protected routes for managing applications
router.get('/', protect, ApplicationController.getAll);
router.get('/:id', protect, ApplicationController.getById);
router.get('/user/:id', ApplicationController.getByUserId);
router.put('/:id', protect, ApplicationController.update);
router.patch('/:id/status', protect, ApplicationController.updateApplicationStatus);
router.delete('/:id', protect, ApplicationController.delete);

module.exports = router;