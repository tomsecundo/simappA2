const Program = require("../domain/ProgramDomain");
const ProgramRepo = require("../repositories/ProgramRepo");

class ProgramController {
    static async create(req, res, next) {
        try {
            const program = new Program(req.body);
            const saved = await ProgramRepo.create(program);
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const programs = await ProgramRepo.findAll();
            res.json(programs);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const program = await ProgramRepo.findById(req.params.id);
            if (!program) {
                return res.status(404).json({ message: "Program not found" });
            }
            res.json(program);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const updated = await ProgramRepo.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Program not found" });
            }
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
    
    static async delete(req, res, next) {
        try {
            const deleted = await ProgramRepo.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Program not found" });
            }
            res.json({ message: "Program deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProgramController; 