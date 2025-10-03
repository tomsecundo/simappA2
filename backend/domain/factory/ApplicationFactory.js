const { UserRole } = require('../../models/UserModel');
const { ApplicationStatus } = require('../../models/ApplicationModel');

const {
    AdminApplicationStrategy,
    MentorApplicationStrategy,
    StartupApplicationStrategy,
    StatusStrategy,
    PendingStatusStrategy,
    UnderReviewStatusStrategy,
    AcceptedStatusStrategy,
    RejectedStatusStrategy
} = require('../strategy/ApplicationStrategy');

class ApplicationFactory {
    static createRoleStrategy(role) {
        switch (role) {
            case UserRole.ADMIN:
                return new AdminApplicationStrategy();
            case UserRole.MENTOR:
                return new MentorApplicationStrategy();
            case UserRole.STARTUP:
                return new StartupApplicationStrategy();
            default:
                throw new Error(`Invalid role: ${role}`);
        }
    }

    static createStatusStrategy(status) {
        switch (status) {
            case ApplicationStatus.PENDING:
                return new PendingStatusStrategy();
            case ApplicationStatus.UNDER_REVIEW:
                return new UnderReviewStatusStrategy();
            case ApplicationStatus.ACCEPTED:
                return new AcceptedStatusStrategy();
            case ApplicationStatus.REJECTED:
                return new RejectedStatusStrategy();
            default:
                return new StatusStrategy();
        }
    }
}

module.exports = ApplicationFactory;
