const express = require("express");
const router = express.Router();
const SessionController = require("../controllers/sessionController");
const validateSession = require("../middleware/validators/validateSession");
const { protect } = require('../middleware/authMiddleware');
const roleProxy = require('../middleware/roleProxy');

// Create a new session
router.post("/", protect, validateSession, SessionController.create);

// Get all sessions
router.get("/", protect, SessionController.getAll);

// Get a session by ID
router.get("/:id", protect, SessionController.getById);

// Update a session by ID
router.put("/:id", protect, validateSession, SessionController.update);

// Delete a session by ID
router.delete("/:id", protect, SessionController.delete);

module.exports = router;