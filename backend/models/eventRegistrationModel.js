const mongoose = require('mongoose');


const eventRegistration = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true},
    status: {
        type: String,
        enum: ['Registered', 'Cancelled'], default: 'Registered'},
}, { timestamps: true });

eventRegistration.index({ event: 1, application: 1}, { unique: true});

module.exports = {
    EventRegistration: mongoose.model('EventRegistration', eventRegistration),
};