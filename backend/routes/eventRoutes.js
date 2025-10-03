const express = require("express");
const router = express.Router();
const EventController = require("../controllers/eventController");
const { protect } = require('../middleware/authMiddleware');
const roleProxy = require('../middleware/roleProxy');

// Create a new event
router.get("/", protect, EventController.getAllEvents);
router.post("/", protect, EventController.createEvent);

//Registration
router.get("/mine", protect, EventController.listMyRegistrations);
router.post("/:eventId/register", protect, EventController.registerForEvent);
router.delete("/:eventId/register", protect, EventController.unregisterFromEvent);

//Event Attendees
router.get("/:eventId/registrations", protect, EventController.listRegistrations);


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