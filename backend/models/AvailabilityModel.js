const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", AvailabilitySchema);