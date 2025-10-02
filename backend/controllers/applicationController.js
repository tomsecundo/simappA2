const crypto = require('crypto');
const Application = require("../domain/ApplicationDomain");
const ApplicationRepo = require('../repositories/ApplicationRepo');
const ProgramRepo = require('../repositories/ProgramRepo');
const { ApplicationStatus } = require('../models/ApplicationModel');
const { UserRole } = require('../models/UserModel');

class ApplicationController {
    async create(req, res, next) {
        try {
            const timestamp = Date.now().toString().slice(-6);
            const randomStr = crypto.randomBytes(4).toString('hex');
            const applicationId = `app-${timestamp}-${randomStr}`;

            const application = new Application({ 
                ...req.body, 
                applicationId,
                createdBy: req.user._id 
            });
            const saved = await ApplicationRepo.create(application);
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const applications = await ApplicationRepo.findAll();
            res.json(applications);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const application = await ApplicationRepo.findById(req.params.id);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }
            res.json(application);
        } catch (error) {
            next(error);
        }
    }

    async getByUserId(req, res, next) {
        try {
            const application = await ApplicationRepo.findByCreatedBy(req.params.id);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }
            res.json(application);
        } catch (error) {
            next(error);
        }
    }

    async getByProgramId(req, res, next) {
        try {
            const programId = req.params.programId || req.params.id;

            // Ensure program exists
            const program = await ProgramRepo.findById(programId);
            if (!program) {
                return res.status(404).json({ message: "Program not found" });
            }

            let applications;

            if (req.user.role === UserRole.ADMIN || req.user.role === UserRole.MENTOR) {
                // Admin sees all
                applications = await ApplicationRepo.findByProgramId(programId);

            } 
            // else if (req.user.role === UserRole.MENTOR) {
            //     // Mentor must be assigned to program
            //     const isAssigned = program.mentors.some(
            //         (m) => m.toString() === req.user._id.toString()
            //     );
            //     if (!isAssigned) {
            //         return res.status(403).json({ message: "Access denied: not assigned to this program" });
            //     }
                    
            //     applications = await ApplicationRepo.findByProgramId(programId);
            // } 
            else if (req.user.role === UserRole.STARTUP) {
                // Startup sees only their applications
                applications = await ApplicationRepo.findByProgramId(programId);
                applications = applications.filter(
                    (app) => app.createdBy._id.toString() === req.user._id.toString()
                );
            } else {
                return res.status(403).json({ message: "Invalid role" });
            }

            if (!applications || applications.length === 0) {
                return res.status(404).json({ message: "No applications found for this program" });
            }
            res.json(applications);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const data = req.body;
            
            const application = await ApplicationRepo.findById(id);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if(![ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW].includes(application.status)) {
                return res.status(400).json({
                    message: `Application cannot be edited because it is already ${application.status}`,
                });
            }

            const updated = await ApplicationRepo.update(id, data);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async updateApplicationStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!Object.values(ApplicationStatus).includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            const updated = await ApplicationRepo.updateStatus(id, status);
            if (!updated) {
                return res.status(404).json({ message: "Application not found" });
            }
            res.json(updated);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const deleted = await ApplicationRepo.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ message: "Application not found" });
            }
            res.json({ message: "Application deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ApplicationController();