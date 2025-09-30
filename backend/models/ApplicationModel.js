const { required } = require("joi");
const mongoose = require("mongoose");

const ApplicationStatus = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected"
};

const applicationSchema = new mongoose.Schema({
    applicationId: { type: String, required: true, unique: true },
    submissionDate: { type: Date, default: Date.now },
    applicationEmail: { type: String, required: true, trim: true },
    applicationPhone: { type: String, required: true, trim: true },
    startupName: { type: String, required: true },
    description: { type: String },

    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.PENDING
    }
}, {
    timestamps: { createdAt: 'createdDateTime', updatedAt: 'updatedDateTime' }
});

module.exports = {
    ApplicationModel: mongoose.model("Application", applicationSchema),
    ApplicationStatus
};