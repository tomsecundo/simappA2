const mongoose = require('mongoose');

const status = {
    STARTED: 'Started',
    NOTSTARTED: 'Not Started',
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed',
};
const progressSchema = new mongoose.Schema({
    progressId: { type: String, required: true, unique: true},
    applicationId: { type: String, required: true},
    mentorEmail: { type: String, required: true},
    phase1: {
        type: String,
        enum: Object.values(status),
        default: status.NOTSTARTED 
        },
    phase2: {
        type: String,
        enum: Object.values(status),
        default: status.NOTSTARTED 
        },
    phase3: {
        type: String,
        enum: Object.values(status),
        default: status.NOTSTARTED 
        },
    phase4: {
        type: String,
        enum: Object.values(status),
        default: status.NOTSTARTED 
        },
    startupName: { type: String, required: true }
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

module.exports = {
    Progress: mongoose.model('Progress', progressSchema)
};