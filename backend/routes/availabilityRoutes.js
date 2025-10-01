const express = require("express");
const router = express.Router();
const AvailabilityController = require("../controllers/availabilityController");
const validateAvailability = require("../middleware/validators/validateAvailability")
// const { protect} = require('../middleware/authMiddleware');

// Create a new availability
router.post("/", protect, validateAvailability, AvailabilityController.create);

// Get all availabilities
router.get("/", AvailabilityController.getAll);

// Get a availability by ID
router.get("/:id", AvailabilityController.getById);

// Update a availabilty by ID
router.put("/:id", protect, validateAvailability, AvailabilityController.update);

// Delete a availability by ID
router.delete("/:id", protect, AvailabilityController.delete);

module.exports = router;