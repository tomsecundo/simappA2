// repositories/UserRepo.js
const { UserModel } = require('../models/UserModel');

class UserRepo {
    async create(userData) {
        const user = new UserModel(userData);
        return user.save();
    }

    async findAll() {
        return UserModel.find().select('-password');
    }

    async findById(id) {
        return UserModel.findById(id).select('-password');
    }

    async findByEmail(email) {
        return UserModel.findOne({ email }).select('+password'); // needed for login
    }

    async updateById(id, updates) {
        delete updates.role; // // Prevent role changes (immutable)
        return UserModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            select: '-password',
        });
    }

    async deleteById(id) {
        return UserModel.findByIdAndDelete(id);
    }
}

module.exports = new UserRepo();
