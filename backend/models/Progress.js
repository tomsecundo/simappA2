const mongoose = require('mongoose');

const status = {
    STARTED: 'Started',
    NOTSTARTED: 'Not Started',
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed',
};
const progressSchema = new mongoose.Schema({
    applicationId: { type: String, required: true, unique: true },
    mentorEmail: { type: String, required: true},
    phase1: {
        type: String,
        enum: Object.values(phaseStatus),
        default: phaseStatus.NOTSTARTED 
        },
    phase2: {
        type: String,
        enum: Object.values(phaseStatus),
        default: phaseStatus.NOTSTARTED 
        },
    phase3: {
        type: String,
        enum: Object.values(phaseStatus),
        default: phaseStatus.NOTSTARTED 
        },
    phase4: {
        type: String,
        enum: Object.values(phaseStatus),
        default: phaseStatus.NOTSTARTED 
        },
    startupName: { type: String, required: true },
    status: { type: String, required: true }
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

module.exports = {
    Progress: mongoose.model('Progress', progressSchema),
    status
};