const { UserModel } = require('../models/UserModel');

class UserRepo {
    async create(userData) {
        return UserModel.create(userData);
    }

    async findAll() {
        return UserModel.find().select('-password');
    }

    async findById(id) {
        return UserModel.findById(id).select('-password');
    }

    async findByEmail(email) {
        return UserModel.findOne({ email }).select('+password');
    }

    async updateById(id, updates) {
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
