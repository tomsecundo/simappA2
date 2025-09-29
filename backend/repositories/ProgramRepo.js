const ProgramModel = require("../models/ProgramModel");
const Program = require("../domain/Program");

class ProgramRepo {
  async create(program) {
    const data = new ProgramModel({
      title: program.title,
      description: program.description,
      startDate: program.startDate,
      endDate: program.endDate
    });

    const saved = await data.save();
    return new Program({
      id: saved._id.toString(),
      title: saved.title,
      description: saved.description,
      startDate: saved.startDate,
      endDate: saved.endDate
    });
  }

  async findById(id) {
    const doc = await ProgramModel.findById(id);
    if (!doc) return null;

    return new Program({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      startDate: doc.startDate,
      endDate: doc.endDate
    });
  }

  async findAll() {
    const docs = await ProgramModel.find();
    return docs.map(
      (doc) =>
        new Program({
          id: doc._id.toString(),
          title: doc.title,
          description: doc.description,
          startDate: doc.startDate,
          endDate: doc.endDate
        })
    );
  }

  async update(id, updates) {
    const doc = await ProgramModel.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return null;

    return new Program({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      startDate: doc.startDate,
      endDate: doc.endDate
    });
  }

  async delete(id) {
    return ProgramModel.findByIdAndDelete(id);
  }
}

module.exports = new ProgramRepo(); // Singleton instance
