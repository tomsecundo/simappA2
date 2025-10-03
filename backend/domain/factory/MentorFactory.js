const Mentor = require('../MentorDomain');
const { UserRole } = require('../../models/UserModel');

class MentorFactory {
    static createMentor(data) {
        if (!data) {
            throw new Error("MentorFactory: data is required");
        }

        if (data.role && data.role !== UserRole.MENTOR) {
            throw new Error("MentorFactory: role must be Mentor");
        }

        return new Mentor({
            _id: data._id,
            id: data.id,
            name: data.name,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            number: data.number,
            password: data.password,
            role: UserRole.MENTOR,
            expertise: data.expertise,
            affiliation: data.affiliation,
            address: data.address,
            programs: data.programs || []
        });
    }

    static createMentors(list = []) {
        return list.map(item => this.createMentor(item.toObject ? item.toObject() : item));
    }
}

module.exports = MentorFactory;
