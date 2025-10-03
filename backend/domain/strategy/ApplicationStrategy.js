const ApplicationRepo = require('../../repositories/ApplicationRepo');

class ApplicationStrategy {
    async getApplications(programId, user, program, status) {
        throw new Error("Method not implemented");
    }
}

class AdminApplicationStrategy extends ApplicationStrategy {
    async getApplications(programId, user, program, statusStrategy) {
        let apps = await ApplicationRepo.findByProgramId(programId);
        return statusStrategy.filter(apps);
    }
}

class MentorApplicationStrategy extends ApplicationStrategy {
    async getApplications(programId, user, program, statusStrategy) {
        const isAssigned = program.mentors.some(
            (m) => m.toString() === user._id.toString()
        );
        if (!isAssigned) {
            throw new Error("Access denied: not assigned to this program");
        }
        let apps = await ApplicationRepo.findByProgramId(programId);
        return statusStrategy.filter(apps);
    }
}

class StartupApplicationStrategy extends ApplicationStrategy {
    async getApplications(programId, user, program, statusStrategy) {
        let apps = await ApplicationRepo.findByProgramId(programId);
        apps = apps.filter(app => app.createdBy._id.toString() === user._id.toString());
        return statusStrategy.filter(apps);
    }
}

class StatusStrategy {
    filter(apps) { return apps; }
}

class PendingStatusStrategy extends StatusStrategy {
    filter(apps) { return apps.filter(a => a.status === "Pending"); }
}

class UnderReviewStatusStrategy extends StatusStrategy {
    filter(apps) { return apps.filter(a => a.status === "Under Review"); }
}

class AcceptedStatusStrategy extends StatusStrategy {
    filter(apps) { return apps.filter(a => a.status === "Accepted"); }
}

class RejectedStatusStrategy extends StatusStrategy {
    filter(apps) { return apps.filter(a => a.status === "Rejected"); }
}

module.exports = {
    ApplicationStrategy,
    AdminApplicationStrategy,
    MentorApplicationStrategy,
    StartupApplicationStrategy,
    StatusStrategy,
    PendingStatusStrategy,
    UnderReviewStatusStrategy,
    AcceptedStatusStrategy,
    RejectedStatusStrategy
};

module.exports = {
    AdminApplicationStrategy,
    MentorApplicationStrategy,
    StartupApplicationStrategy
};
