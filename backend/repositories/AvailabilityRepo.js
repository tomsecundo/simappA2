const AvailabilityModel = require("../models/AvailabilityModel");
const Availability = require("../domain/Availability");

class AvailabilityRepo {
  async create(availability) {
    const data = new AvailabilityModel({
      startDate: availability.startDate,
      endDate: availability.endDate
    });

    const saved = await data.save();
    return new Availability({
      id: saved._id.toString(),
      startDate: saved.startDate,
      endDate: saved.endDate
    });
  }

  async findById(id) {
    const doc = await AvailabilityModel.findById(id);
    if (!doc) return null;

    return new Availability({
      id: doc._id.toString(),
      startDate: doc.startDate,
      endDate: doc.endDate
    });
  }

  async findAll() {
    const docs = await AvailabilityModel.find();
    return docs.map(
      (doc) =>
        new Availability({
          id: doc._id.toString(),
          startDate: doc.startDate,
          endDate: doc.endDate
        })
    );
  }

  async update(id, updates) {
    const doc = await AvailabilityModel.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return null;

    return new Availability({
      id: doc._id.toString(),
      startDate: doc.startDate,
      endDate: doc.endDate
    });
  }

  async delete(id) {
    return AvailabilityModel.findByIdAndDelete(id);
  }
}

module.exports = new AvailabilityRepo(); // Singleton instance