const bcrypt = require('bcrypt');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserModel, UserRole } = require('../models/UserModel');

class UserController {   
    async getAllUsers(req, res, next) {
        try {
            const users = await UserRepo.findAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Not authorized' });

            const user = await UserRepo.findById(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            if (user.role === UserRole.MENTOR) {
                const mentor = await MentorRepo.findById(user._id);
                return res.json({
                    ...user.toObject(),
                    expertise: mentor?.expertise || null,
                    programs: mentor?.programs || [],
                });
            }
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await UserRepo.findById(req.params.id);
            if (!user) return res.status(404).json({message:'User not Found'});
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateUserProfile(req, res, next) {
        try {
            const updatedUser = await UserRepo.updateById(req.user._id, req.body);
            res.json(updatedUser);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                return res.status(400).json({ 
                    message: 'Email already exists. Please use a different email address.'
                });
            }
            next(error);
        }
    }

    async updateUserByAdmin(req, res, next) {
        try {
            if (req.user.role !== UserRole.ADMIN) {
                return res.status(403).json({ message: 'Admin access only' });
            }

            const { id } = req.params;
            const updates = req.body;

            // Update base user fields
            let updatedUser = await UserRepo.updateById(id, updates);

            // If mentor, also update mentor-specific fields
            if (updatedUser && updatedUser.role === UserRole.MENTOR) {
                updatedUser = await MentorRepo.updateById(id, updates);
            }

            if (!updatedUser) return res.status(404).json({ message: 'User not found' });

            res.json(updatedUser);
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

            res.json({ message: 'Password updated successfully' });
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

const listStartups = async (req, res) => {
    try {
        const { q } = req.query;

        const roleValue = UserRole.STARTUP || 'Startup';
        const query = { role: roleValue };
        if (q) query.name = {$regex: q, $options: 'i'};

        const startups = await UserModel.find(query)
            .select('_id name email')
            .lean();

        res.json(startups);
    } catch (err) {
        console.error('GET /api/user/startups failed:', err);
        res.status(500).json({message: 'Failed to load startups', error: err.message});
    }
};
const ctrl = new UserController();
module.exports = {UserController: ctrl, listStartups};