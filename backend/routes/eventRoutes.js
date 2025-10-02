const express = require("express");
const router = express.Router();
const EventController = require("../controllers/eventController");
const { protect } = require('../middleware/authMiddleware');

// Create a new event
router.post("/", protect, EventController.createEvent);

// Get all events
router.get("/", protect, EventController.getAllEvents);

// Filter using event type and coverage
router.get("/type/:eventType", protect, EventController.getEventByType);
router.get("/coverage/:coverage", protect, EventController.getEventByCoverage);

// Get a event by ID
router.get("/:id", protect, EventController.getEventById);

// Update a event by ID
router.put("/:id", protect, EventController.updateEvent);

// Delete a event by ID
router.delete("/:id", protect, EventController.deleteEvent);

module.exports = router;