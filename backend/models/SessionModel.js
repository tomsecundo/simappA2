const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
    {
        applicationName: { type: String, required: true },
        mentorfirstName: { type: String, required: true },
        mentorlastName: { type: String, required: true },
        sessionDate: { type: Date, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
