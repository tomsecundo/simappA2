const UserRepo = require('../repositories/UserRepo');
const User = require('../domain/UserDomain');

class UserController {
    async getAllUsers(req, res, next) {
        try {
            const users = await UserRepo.findAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = await UserRepo.findById(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await UserRepo.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateUserProfile(req, res, next) {
        try {
            const updatedUser = await UserRepo.updateById(req.user._id, req.body);
            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    async createUser(req, res, next) {
        try {
            const domainUser = new User(req.body);
            const newUser = await UserRepo.create(domainUser);
            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();