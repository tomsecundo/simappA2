const express = require("express");
const router = express.Router();
const AvailabilityController = require("../controllers/availabilityController");
const validateAvailability = require("../middleware/validateAvailability");
const { protect, mentorOnly } = require('../middleware/authMiddleware');

// Create a new availability
router.post("/", protect, mentorOnly, validateAvailability, AvailabilityController.create);

// Get all availabilities
router.get("/", AvailabilityController.getAll);

// Get a availability by ID
router.get("/:id", AvailabilityController.getById);

// Update a availabilty by ID
router.put("/:id", protect, mentorOnly, validateAvailability, AvailabilityController.update);

// Delete a availability by ID
router.delete("/:id", protect, mentorOnly, AvailabilityController.delete);

module.exports = router;