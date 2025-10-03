const crypto = require('crypto');
const Application = require("../domain/ApplicationDomain");
const ApplicationRepo = require('../repositories/ApplicationRepo');
const ProgramRepo = require('../repositories/ProgramRepo');
const { ApplicationStatus } = require('../models/ApplicationModel');
const ApplicationFactory = require('../domain/factory/ApplicationFactory');

class ApplicationController {
    /** Create new application */
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

    /** Get all applications */
    async getAll(req, res, next) {
        try {
            const applications = await ApplicationRepo.findAll();
            res.json(applications);
        } catch (error) {
            next(error);
        }
    }

    /** Get application by ID */
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

    /** Get application(s) by User ID */
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

    /** Get applications by Program ID (with Role + Status strategies) */
    async getByProgramId(req, res, next) {
        try {
            const programId = req.params.programId || req.params.id;
            const program = await ProgramRepo.findById(programId);

            if (!program) {
                return res.status(404).json({ message: "Program not found" });
            }

            // 1. Pick role strategy
            const roleStrategy = ApplicationFactory.createRoleStrategy(req.user.role);

            // 2. Pick status strategy (optional query ?status=Accepted)
            const statusStrategy = ApplicationFactory.createStatusStrategy(req.query.status);

            // 3. Delegate to strategy
            const applications = await roleStrategy.getApplications(programId, req.user, program, statusStrategy);

            if (!applications || applications.length === 0) {
                return res.status(404).json({ message: "No applications found for this program" });
            }

            res.json(applications);
        } catch (error) {
            if (error.message.includes("Access denied")) {
                return res.status(403).json({ message: error.message });
            }
            next(error);
        }
    }

    /** Update application data */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            
            const application = await ApplicationRepo.findById(id);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if (![ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW].includes(application.status)) {
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

    /** Update application status */
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

    /** Delete application */
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