const express = require("express");
const router = express.Router();
const ProgramController = require("../controllers/programController");
const validateProgram = require("../validators/validateProgram");
const { protect, hasRole } = require('../middleware/authMiddleware');
const { UserRole } = require('../models/UserModel');

// Create a new program
router.post("/", protect, hasRole(UserRole.ADMIN), validateProgram, ProgramController.create);

// Get all programs
router.get("/", protect, ProgramController.getAll);

// Get a program by ID
router.get("/:id", protect, ProgramController.getById);

// Update a program by ID
router.put("/:id", protect, hasRole(UserRole.ADMIN), validateProgram, ProgramController.update);

// Delete a program by ID
router.delete("/:id", protect, hasRole(UserRole.ADMIN), ProgramController.delete);

module.exports = router;