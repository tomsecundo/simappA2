const mongoose = require('mongoose');

const phaseStatus = {
    PENDING: 'Pending',
    SUBMITTED: 'Submitted',
    REVIEWED: 'Reviewed',
    COMPLETE: 'Complete'
};
const reportSchema = new mongoose.Schema({
    reportId: { type: String, required: true, unique: true },
    applicationId: { type: String, required: true, unique: true },
    mentorEmail: { type: String, required: true, unique: true },
    submissionDate: { type: Date, default: Date.now },
    phase: { type: String, required: true },
    programApplied: { type: String, required: true },
    startupName: { type: String, required: true },
    description: { type: String },
    remarks:  {
        type: String,
        enum: Object.values(phaseStatus),
        default: phaseStatus.PENDING 
        }
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

module.exports = {
    Report: mongoose.model('Report', reportSchema),
    phaseStatus
};