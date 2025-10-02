const mongoose = require('mongoose');

const EventType = {
    NETWORKING: 'Networking',
    DEMO: 'Demo Day',
};

const EventCoverage = {
    PRIVATE: 'Private',
    PUBLIC: 'Public',
};


const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true},
    eventDescription: { type: String, required: true},
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
    eventType: {
        type: String,
        enum: Object.values(EventType),
        default: EventType.DEMO 
        },
    coverage: {
        type: String,
        enum: Object.values(EventCoverage),
        default: EventCoverage.PUBLIC 
        },
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

module.exports = {
    Event: mongoose.model('Event', eventSchema),
    EventType,
    EventCoverage
};