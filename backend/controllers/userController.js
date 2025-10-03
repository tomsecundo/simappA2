const bcrypt = require('bcrypt');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const UserFactory = require('../domain/factory/UserFactory');
const { UserRole } = require('../models/UserModel');

class UserController {
    /** Get all users (role strategy only) */
    async getAllUsers(req, res, next) {
        try {
            const roleStrategy = UserFactory.createRoleStrategy(req.user.role);
            let users = await roleStrategy.getUsers(req.user);

            const domainUsers = users.map(u => UserFactory.createUser(u.toObject ? u.toObject() : u));

            res.json(domainUsers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                number: u.number,
                affiliation: u.affiliation,
                address: u.address,
                expertise: u.expertise || null,
                programs: u.programs || [],
                status: u.status || "Active"
            })));
        } catch (error) {
            next(error);
        }
    }

    /** Get user by ID (role strategy applies) */
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const roleStrategy = UserFactory.createRoleStrategy(req.user.role);

            let users = await roleStrategy.getUsers(req.user);

            const user = users.find(u => (u._id?.toString() || u.id?.toString()) === id.toString());
            if (!user) {
                return res.status(403).json({ message: 'Access denied or user not found' });
            }

            const domainUser = UserFactory.createUser(user.toObject ? user.toObject() : user);

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
                status: domainUser.status || "Active"
            });
        } catch (error) {
            next(error);
        }
    }

    /** Get logged-in user profile */
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
                status: domainUser.status || "Active"
            });
        } catch (err) {
            next(err);
        }
    }

    /** Update profile (self) */
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
                programs: domainUser.programs || [],
                status: domainUser.status || "Active"
            });
        } catch (error) {
            next(error);
        }
    }

    /** Update user (Admin or delegated strategy) */
    async updateUserByAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const roleStrategy = UserFactory.createRoleStrategy(req.user.role);
            const updatedUser = await roleStrategy.updateUser(id, updates, req.user);

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found or not allowed to update' });
            }

            const domainUser = UserFactory.createUser(updatedUser.toObject ? updatedUser.toObject() : updatedUser);

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
                status: domainUser.status || "Active"
            });
        } catch (error) {
            if (error.message.includes("not allowed")) {
                return res.status(403).json({ message: error.message });
            }
            next(error);
        }
    }

    /** Change password */
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
                    role: domainUser.role,
                    status: domainUser.status || "Active"
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /** Delete user (Admin only for now) */
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
    }
}

/** Additional listStartups function */
const listStartups = async (req, res) => {
    try {
        const { q } = req.query;
        const query = { role: UserRole.STARTUP };
        if (q) query.name = { $regex: q, $options: 'i' };

        const startups = await UserRepo.find(query).select('_id name email').lean();
        res.json(startups);
    } catch (err) {
        console.error('GET /api/user/startups failed:', err);
        res.status(500).json({ message: 'Failed to load startups', error: err.message });
    }
};

const ctrl = new UserController();
module.exports = { UserController: ctrl, listStartups };
