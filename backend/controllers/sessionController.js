const Session = require("../domain/SessionDomain");
const SessionRepo = require("../repositories/SessionRepo");
const AvailabilityModel = require("../models/AvailabilityModel");

class SessionController {
    static async create(req, res, next) {
        try {

            const date = new Date(req.body.sessionDate);
            const match = await AvailabilityModel.findOne({
                startDate: {$lte: date},
                endDate: {$gte: date},
            });

            if(!match) {
                return res.status(422).json({ message: "Mentor is not available on that date."});
            }

            const session = new Session(req.body);
            const saved = await SessionRepo.create(session);
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const sessions = await SessionRepo.findAll();
            res.json(sessions);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const session = await SessionRepo.findById(req.params.id);
            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }
            res.json(session);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {

            if ('sessionDate' in req.body) {
                const date = new Date(req.body.sessionDate);
                const match = await AvailabilityModel.exists({
                    startDate: {$lte: date},
                    endDate: {$gte: date},
                });
                if(!match) {
                    return res.status(422).json({ message: "Mentor is not available on that date."});
                }
            }
            
            const updated = await SessionRepo.update(req.params.id, req.body);
            if (!updated) return res.status(404).json({message: "Session not found"});
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
    
    static async delete(req, res, next) {
        try {
            const deleted = await SessionRepo.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Session not found" });
            }
            res.json({ message: "Session deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SessionController; 