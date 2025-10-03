const UserRepo = require('../../repositories/UserRepo');
const MentorRepo = require('../../repositories/MentorRepo');

class UserStrategy {
    async getUsers(currentUser, statusStrategy) {
        throw new Error("Method not implemented");
    }
}

/** ---------- ROLE STRATEGIES ---------- **/

// Admin sees all users
class AdminUserStrategy extends UserStrategy {
    async getUsers(currentUser, statusStrategy) {
        let users = await UserRepo.findAll();
        return statusStrategy.filter(users);
    }
}

// Mentor sees only their own profile (+ mentor details)
class MentorUserStrategy extends UserStrategy {
    async getUsers(currentUser, statusStrategy) {
        const user = await UserRepo.findById(currentUser._id);
        const mentor = await MentorRepo.findById(currentUser._id);
        let users = [{ ...user.toObject(), ...mentor?.toObject() }];
        return statusStrategy.filter(users);
    }
}

// Startup sees only their own account
class StartupUserStrategy extends UserStrategy {
    async getUsers(currentUser, statusStrategy) {
        const user = await UserRepo.findById(currentUser._id);
        let users = [user];
        return statusStrategy.filter(users);
    }
}

/** ---------- STATUS STRATEGIES ---------- **/

class StatusStrategy {
    filter(users) { return users; }
}

class ActiveStatusStrategy extends StatusStrategy {
    filter(users) { return users.filter(u => u.status === "Active"); }
}

class InactiveStatusStrategy extends StatusStrategy {
    filter(users) { return users.filter(u => u.status === "Inactive"); }
}

class SuspendedStatusStrategy extends StatusStrategy {
    filter(users) { return users.filter(u => u.status === "Suspended"); }
}

module.exports = {
    UserStrategy,
    AdminUserStrategy,
    MentorUserStrategy,
    StartupUserStrategy,
    StatusStrategy,
    ActiveStatusStrategy,
    InactiveStatusStrategy,
    SuspendedStatusStrategy
};
