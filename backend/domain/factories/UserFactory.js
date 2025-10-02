const User = require('../UserDomain');
const Mentor = require('../MentorDomain');
const { UserRole } = require('../../models/UserModel');

class UserFactory {
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
                });
            default:
                throw new Error(`Invalid role: ${data.role}`);
        }
    }
}

module.exports = UserFactory;
