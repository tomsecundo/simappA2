const { Event, EventType, EventCoverage } = require('../models/eventModel');
const { EventRegistration  } = require('../models/eventRegistrationModel');

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { eventName,
                eventDescription,
                eventDate,
                eventVenue,
                eventType,
                coverage,
                } = req.body;

        if (!eventName || !eventDescription || !eventDate || !eventVenue) {
                return res.status(400).json({message: 'Event name, description, date, and venue are required.'});
        }

        if (eventType && !Object.values(EventType).includes(eventType)) {
            return res.status(400).json({message: 'Please choose within the selection only.'});
        }

        if (coverage && !Object.values(EventCoverage).includes(coverage)) {
            return res.status(400).json({message: 'Please choose within the selection only.'});
        }

        const event = new Event({eventName, eventDescription, eventDate, eventVenue, eventType, coverage});

        const submittedEvent = await event.save();
        res.status(201).json(submittedEvent);
    } catch (error) {
        res.status(500).json({ message:"Failed to submit an event", error: error.message});
    }
};

// Get all event (Read)
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events', error: error.message});
    }
};

// Get a event by eventID
const getEventByType = async (req, res) => {
    try {
        const { eventType } = req.params;

        if (!Object.values(EventType).includes(eventType)) {
            return res.status(400).json({ message: 'Please choose within the selection.'});
        }

        const events = await Event.find({ eventType }).sort({ eventDate:-1 });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found for this event type'});
        }        

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch event/s', error: error.message });
    }
};

// Get a event by eventID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch event', error: error.message });
    }
};
// Get events by Coverage
const getEventByCoverage = async (req, res) => {
    try {
        const { coverage } = req.params;

        if(!Object.values(EventCoverage).includes(coverage)) {
            return res.status(400).json({ message: 'Please choose within the selection only'});
        }

        const events = await Event.find({ coverage }).sort({ eventDate: -1 });
        if (!events.length) {
            return res.status(404).json({ message: 'No events found for this event setting' });
        }
        
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch event/s', error: error.message });
    }
};

// Update event details
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        const {
            eventName,
            eventDescription,
            eventDate,
            eventVenue,
            eventType,
            coverage
        } = req.body;

        if (eventType !== undefined && !Object.values(EventType).includes(eventType)) {
            return res.status(400).json({ message: 'Please choose within the selection only'});
        }

         if(coverage !== undefined && !Object.values(EventCoverage).includes(coverage)) {
            return res.status(400).json({ message: 'Please choose within the selection only'});
        }

        if (eventName !== undefined) event.eventName = eventName;
        if (eventDescription !== undefined) event.eventDescription = eventDescription;
        if (eventDate !== undefined) event.eventDate = eventDate;
        if (eventVenue !== undefined) event.eventVenue = eventVenue;
        if (eventType !== undefined) event.eventType = eventType;
        if (coverage !== undefined) event.coverage = coverage;

        const updated = await event.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update an event', error: error.message });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Only allow admin to delete it
        // if (req.user.role !== 'admin' && application.userId.toString() !== req.user.id)
        // if (req.user.role !== 'admin') {
        //     return res.status(403).json({ message: 'Not authorized to delete this application' });
        // }
        
        await Event.deleteOne({ _id: req.params.id });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Deleting event error:', error);
        res.status(500).json({ 
            message: 'Failed to delete event', 
            error: error.message 
        });
    }
};

const registerForEvent = async (req, res) => {
    try {
        const {eventId} = req.params;
        const { applicationId } = req.body || {};


        const event = await Event.findById(eventId);
        if(!event) return res.status(404).json({ message: 'Event not found' });

        const reg = await EventRegistration.create({
            event: eventId,
            user: req.user._id,
            application: applicationId
        });

        res.status(201).json(reg);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Already registered for this event.'});
        }
        res.status(500).json({  message: 'Failed to register', error: err.message });
    }
};
    //Cancel registration
    const unregisterFromEvent = async (req,res) => {
        try {
            const { eventId} = req.params;
            const result = await EventRegistration.deleteOne({ event: eventId, user: req.user._id});
            if (!result.deletedCount) return res.status(404).json({ message: 'Not registered'});
            res.json({ message: 'Registration cancelled'});
        } catch (err) {
            res.status(500).json({ message: 'Failed to cancel registration', error: err.message});
        }
    };

    // List of event attendees
    const listRegistrations = async (req, res) => {
        try {
            const { eventId } = req.params;

            const regs = await EventRegistration
                .find({ event: eventId, status: 'Registered'})
                .populate('user', 'name email')
                .populate('application', 'applicationName')
                .sort({ createdAt: -1 });

            if (regs.length === 0) {
                return res.status(200).json({
                    message: 'Not registered to any event/s',
                    registrations: []
                });
            }
            res.json(regs);
        } catch (err) {
            res.status(500).json({  message: 'Failed to load registrations', error: err.message});
        }
    };
    
    //User registration
    const listMyRegistrations = async (req, res) => {
        try {
            const regs = await EventRegistration
            .find({ user: req.user._id, status: 'Registered'})
            .populate('event', 'eventName eventDate eventVenue eventType coverage')
            .populate('application', 'applicationName')
            .sort({ createdAt: -1 })
            .lean();

            if (regs.length === 0) {
                return res.status(200).json({
                    message: 'Not registered to any event/s',
                    registrations: []
                });
            }

            res.json(regs.map(r => ({
                event: r.event,
                application: r.application ?? null
        })));
        } catch (err) {
            res.status(500).json({ message: 'Failed to load my registrations', error: err.message });
        }
    };

module.exports = { 
    createEvent, 
    getAllEvents,
    getEventById,
    getEventByType,
    getEventByCoverage,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    listRegistrations,
    listMyRegistrations,
};