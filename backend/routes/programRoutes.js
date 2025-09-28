const express = require("express");
const router = express.Router();
const ProgramController = require("../controllers/programController");
const validateProgram = require("../middleware/validateProgram");
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create a new program
router.post("/", protect, adminOnly, validateProgram, ProgramController.create);

// Get all programs
router.get("/", ProgramController.getAll);

// Get a program by ID
router.get("/:id", ProgramController.getById);

// Update a program by ID
router.put("/:id", protect, adminOnly, validateProgram, ProgramController.update);

// Delete a program by ID
router.delete("/:id", protect, adminOnly, ProgramController.delete);

module.exports = router;