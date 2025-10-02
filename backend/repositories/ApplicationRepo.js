const { ApplicationModel } = require("../models/ApplicationModel");

class ApplicationRepository {
    async create(application) {
        return await ApplicationModel.create(application);
    }

    async findAll() {
        return await ApplicationModel.find().sort({ submissionDate: -1 })
                        .populate("program", "title")
                        .populate("createdBy", "name email role");
    }

    async findById(id) {
        return await ApplicationModel.findById(id)
                        .populate("program", "title")
                        .populate("createdBy", "name email role");
    }

    async findByCreatedBy(userId) {
        return await ApplicationModel.find({ createdBy: userId })
                        .sort({ submissionDate: -1 })
                        .populate("program", "title")
                        .populate("createdBy", "name email role");
    }

    async findByProgramId(programId) {
        return await ApplicationModel.find({ program: programId })
            .sort({ createdAt: -1 })
            .populate("program", "title")
            .populate("createdBy", "name email role");
    }

    async update(id, data) {
        return await ApplicationModel
                        .findByIdAndUpdate(id, data, { new: true })
                        .populate("program", "title")
                        .populate("createdBy", "name email role");
    }

    async updateStatus(id, status) {
        return await ApplicationModel
                        .findByIdAndUpdate(id, { status }, { new: true })
                        .populate("program", "title")
                        .populate("createdBy", "name email role");
    }

    async delete(id) {
        return await ApplicationModel.findByIdAndDelete(id);
    }
}

module.exports = new ApplicationRepository(); // Singleton instance
