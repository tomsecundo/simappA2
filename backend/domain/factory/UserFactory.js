const User = require('../UserDomain');
const Mentor = require('../MentorDomain');
const { UserRole } = require('../../models/UserModel');
const {
    AdminUserStrategy,
    MentorUserStrategy,
    StartupUserStrategy
} = require('../strategy/UserStrategy');

class UserFactory {
    /** Domain object creation (existing functionality) */
    static createUser(data) {
        switch (data.role) {
            case UserRole.MENTOR:
                return new Mentor({
                    _id: data._id,
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    number: data.number,
                    expertise: data.expertise,
                    affiliation: data.affiliation,
                    address: data.address,
                    programs: data.programs || [],
                    status: data.status || "Active"
                });
            case UserRole.STARTUP:
            case UserRole.ADMIN:
                return new User({
                    _id: data._id,
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    number: data.number,
                    affiliation: data.affiliation,
                    address: data.address,
                    status: data.status || "Active"
                });
                
            default:
                throw new Error(`Invalid role: ${data.role}`);
        }
    }

    static createRoleStrategy(role) {
        switch (role) {
            case UserRole.ADMIN:
                return new AdminUserStrategy();
            case UserRole.MENTOR:
                return new MentorUserStrategy();
            case UserRole.STARTUP:
                return new StartupUserStrategy();
            default:
                throw new Error(`Invalid role: ${role}`);
        }
    }
}

console.log("User import:", User);
console.log("Mentor import:", Mentor);

module.exports = UserFactory;
