const { UserModel, UserRole } = require('../models/UserModel');
const MentorModel = require('../models/MentorModel');
const User = require('../domain/UserDomain');

async function enrichUser(userDoc) {
    if (!userDoc) return null;
    const plain = userDoc.toObject ? userDoc.toObject() : userDoc;

    if (plain.role === UserRole.MENTOR) {
        const mentor = await MentorModel.findById(plain._id).populate('programs');
        return {
        ...plain,
        expertise: mentor?.expertise || null,
        programs: mentor?.programs || [],
        };
    }
    return plain;
}

class UserRepo {
    async create(userData) {
        const domainUser = new User(userData);
        const user = new UserModel(domainUser);
        return user.save();
    }

    async findAll() {
        const users = await UserModel.find().select('-password');
        return Promise.all(users.map(enrichUser));
    }

    async findById(id) {
        const user = await UserModel.findById(id).select('-password');
        return enrichUser(user);
    }

    async findByEmail(email) {
        const user = await UserModel.findOne({ email }).select('+password');
        return enrichUser(user);
    }

    async updateById(id, updates) {
        delete updates.role;
        const user = await UserModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        select: '-password',
        });
        return enrichUser(user);
    }

    async deleteById(id) {
        return UserModel.findByIdAndDelete(id);
    }
}

module.exports = new UserRepo();
