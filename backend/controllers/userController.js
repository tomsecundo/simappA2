const bcrypt = require('bcrypt');
const User = require('../domain/UserDomain');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserRole } = require('../models/UserModel');
const UserFactory = require('../domain/factories/UserFactory');

class UserController {   
    async getAllUsers(req, res, next) {
        try {
            const users = await UserRepo.findAll();
            const domainUsers = users.map(u => UserFactory.createUser(u.toObject()));
            res.json(domainUsers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                number: u.number,
                affiliation: u.affiliation,
                address: u.address,
                expertise: u.expertise || null,
                programs: u.programs || []
            })));
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Not authorized' });

            const user = await UserRepo.findById(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            let data = user.toObject();
            if (user.role === UserRole.MENTOR) {
                const mentor = await MentorRepo.findById(user._id);
                data = { ...data, ...mentor?.toObject() };
            }

            const domainUser = UserFactory.createUser(data);

            res.json({
                id: domainUser.id,
                name: domainUser.name,
                email: domainUser.email,
                role: domainUser.role,
                number: domainUser.number,
                affiliation: domainUser.affiliation,
                address: domainUser.address,
                expertise: domainUser.expertise || null,
                programs: domainUser.programs || [],
            });
        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await UserRepo.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not Found' });

            const domainUser = UserFactory.createUser(user.toObject());
            res.json({
                id: domainUser.id,
                name: domainUser.name,
                email: domainUser.email,
                role: domainUser.role,
                number: domainUser.number,
                affiliation: domainUser.affiliation,
                address: domainUser.address,
                expertise: domainUser.expertise || null,
                programs: domainUser.programs || []
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUserProfile(req, res, next) {
        try {
            let updatedUser = await UserRepo.updateById(req.user._id, req.body);
            if (updatedUser && updatedUser.role === UserRole.MENTOR) {
                updatedUser = await MentorRepo.updateById(req.user._id, req.body);
            }
            if (!updatedUser) return res.status(404).json({ message: 'User not found' });

            const domainUser = UserFactory.createUser(updatedUser.toObject());
            res.json({
                id: domainUser.id,
                name: domainUser.name,
                email: domainUser.email,
                role: domainUser.role,
                number: domainUser.number,
                affiliation: domainUser.affiliation,
                address: domainUser.address,
                expertise: domainUser.expertise || null,
                programs: domainUser.programs || []
            });
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                return res.status(400).json({ 
                    message: 'Email already exists. Please use a different email address.'
                });
            }
            next(error);
        }
    };

    async updateUserByAdmin(req, res, next) {
        try {
            if (req.user.role !== UserRole.ADMIN) {
                return res.status(403).json({ message: 'Admin access only' });
            }

            const { id } = req.params;
            const updates = req.body;

            let updatedUser = await UserRepo.updateById(id, updates);
            if (updatedUser && updatedUser.role === UserRole.MENTOR) {
                updatedUser = await MentorRepo.updateById(id, updates);
            }
            if (!updatedUser) return res.status(404).json({ message: 'User not found' });

            const domainUser = UserFactory.createUser(updatedUser.toObject());
            res.json({
                id: domainUser.id,
                name: domainUser.name,
                email: domainUser.email,
                role: domainUser.role,
                number: domainUser.number,
                affiliation: domainUser.affiliation,
                address: domainUser.address,
                expertise: domainUser.expertise || null,
                programs: domainUser.programs || []
            });
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                return res.status(400).json({ message: 'Email already exists. Please use a different email address.' });
            }
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Both old and new password are required' });
            }

            const user = await UserRepo.findByIdWithPassword(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

            const hashed = await bcrypt.hash(newPassword, 10);
            user.password = hashed;
            await user.save();

            const domainUser = UserFactory.createUser(user.toObject());
            res.json({ 
                message: 'Password updated successfully',
                user: {
                    id: domainUser.id,
                    name: domainUser.name,
                    email: domainUser.email,
                    role: domainUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            if (req.user.role !== UserRole.ADMIN) {
                return res.status(403).json({ message: 'Admin access only' });
            }

            const deleted = await UserRepo.deleteById(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'User not found' });

            res.json({ id: req.params.id, deleted: true });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserController();