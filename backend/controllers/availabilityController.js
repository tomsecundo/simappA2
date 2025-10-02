const Availability = require("../domain/Availability");
const AvailabilityRepo = require("../repositories/AvailabilityRepo");

class AvailabilityController {
    static async create(req, res, next) {
        try {
            const availability = new Availability(req.body);
            const saved = await AvailabilityRepo.create(availability);
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const availability = await AvailabilityRepo.findAll();
            res.json(availability);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const availability = await AvailabilityRepo.findById(req.params.id);
            if (!availability) {
                return res.status(404).json({ message: "Availability not found" });
            }
            res.json(availability);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const updated = await AvailabilityRepo.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Availability not found" });
            }
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
    
    static async delete(req, res, next) {
        try {
            const deleted = await AvailabilityRepo.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Availability not found" });
            }
            res.json({ message: "Availability deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AvailabilityController; 