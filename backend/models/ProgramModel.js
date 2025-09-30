const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, minlength: 3 },
        description: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Program", ProgramSchema);
