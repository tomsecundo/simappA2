const User = require('../domain/UserDomain');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserRole } = require('../models/UserModel');

class UserController {   

    /**
     * @access UserRole: Admin 
     * @returns all users
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await UserRepo.findAll();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
    /**
     * @returns self
     */
    async getProfile(req, res, next) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Not authorized' });

            const user = await UserRepo.findById(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // If mentor profile
            if (user.role === UserRole.MENTOR) {
                const mentor = await MentorRepo.findById(user._id);
                return res.json({
                    ...user.toObject(),
                    expertise: mentor?.expertise || null,
                    programs: mentor?.programs || [],
                });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @access UserRole: Admin and Mentor
     * @returns User by Id
     */
    async getUserById(req, res, next) {
        try {
            const user = await UserRepo.findById(req.params.id);
            if (!user) return res.status(404).json({message:'User not Found'});
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Updates the current User
     * @returns current updated User
     */
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
    };

    /**
     * @ self
     * @returns 
     */
    async changePassword() {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Both old and new password are required' });
            }

            const user = await UserRepo.findById(req.user._id);
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

    /**
     * @access UserRole: Admin
     * @returns 
     */
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