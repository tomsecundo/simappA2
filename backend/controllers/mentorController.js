const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Mentor = require('../domain/MentorDomain');
const MentorRepo = require('../repositories/MentorRepo');
const UserRepo = require('../repositories/UserRepo');
const { UserRole } = require('../models/UserModel');

class MentorController {

    async create(req, res, next) {
        try {
            const mentorData = new Mentor(req.body);
            const saved = await MentorRepo.create({ ...mentorData, role: UserRole.MENTOR });
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @returns All Mentors
     */
    async getAll(req, res, next) {
        try {
            const mentors = await MentorRepo.findAll();
            res.json(mentors);
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
            if (req.user.role !== 'Mentor') return res.status(403).json({ message: 'Access denied: not a Mentor' });

            const mentor = await MentorRepo.findById(req.user.id);
            if (!mentor) {
                return res.status(404).json({ message: 'Mentor not found' });
            }
            res.json(mentor);
        } catch (error) {
            next(error);
        }
    }

    // Admin or mentor self: update mentor profile (extends user updateProfile)
    async updateProfile(req, res, next) {
        try {
            if (!req.user) return res.status(401).json({ message: 'Not authorized' });

            const targetId = req.params.id || req.user._id;

            // Only Admin can update someone else's profile
            if (req.user.role !== UserRole.ADMIN && req.user._id.toString() !== targetId.toString()) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Split updates: user-level vs mentor-level
            const { name, email, role, address, expertise, affiliation, number } = req.body;

            // Update base user fields
            let updated = await UserRepo.updateById(targetId, { name, email, role, address, number });

            // If mentor-specific fields provided
            if (updated && (expertise || affiliation)) {
                updated = await MentorRepo.findByIdAndUpdate(
                    targetId,
                    { expertise, affiliation },
                    { new: true, runValidators: true }
                );
            }

            if (!updated) return res.status(404).json({ message: 'Mentor not found' });

            res.json(updated);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.email) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            next(error);
        }
    }

    /**
     * @returns Mentor by Id
     */
    async getById(req, res, next) {
        try {
            if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.MENTOR) {
                return res.status(403).json({ message: "Access denied: insufficient role" });
            }

            const mentor = await MentorRepo.findById(req.params.id);
            if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
            res.json(mentor);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @
     */
    async addProgram(req, res, next) {
        try {
            const { program_id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(program_id)) {
                return res.status(400).json({ message: 'Invalid program' });
            }

            const updatedMentor = await MentorRepo.addProgram(req.params.id, program_id);
            if (!updatedMentor) {
                return res.status(404).json({ message: 'Mentor not found' });
            }

            res.json(updatedMentor);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @
     */
    async removeProgram(req, res, next) {
        try {
            const updatedMentor = await MentorRepo.removeProgram(req.params.id, req.body.program_id);
            res.json(updatedMentor);
        } catch (error) {
            next(error);
        }
    }

    async enrollInProgram(req, res, next) {
        try {
            const { program_id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(program_id)) {
                return res.status(400).json({ message: 'Invalid program ID' });
            }

            const updatedMentor = await MentorRepo.addProgram(req.user._id, program_id);
            if (!updatedMentor) return res.status(404).json({ message: 'Mentor not found' });

            res.json(updatedMentor);
        } catch (error) {
            next(error);
        }
    }

    async leaveProgram(req, res, next) {
        try {
            const { program_id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(program_id)) {
                return res.status(400).json({ message: 'Invalid program ID' });
            }

            const updatedMentor = await MentorRepo.removeProgram(req.user._id, program_id);
            if (!updatedMentor) return res.status(404).json({ message: 'Mentor not found' });

            res.json(updatedMentor);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @ self
     */
    async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Both old and new password are required' });
            }

            const mentor = await MentorRepo.findById(req.user._id);
            if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

            const isMatch = await bcrypt.compare(oldPassword, mentor.password);
            if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

            const hashed = await bcrypt.hash(newPassword, 10);
            mentor.password = hashed;
            await mentor.save();

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            next(error);
        }
    }
    /**
     * @access UserRole: Admin
     * @returns 
     */
    async deleteMentor(req, res, next) {
        try {
            if (req.user.role !== UserRole.ADMIN) {
                return res.status(403).json({ message: 'Admin access only' });
            }

            const mentor = await MentorRepo.findById(req.params.id);
            if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

            await mentor.deleteOne();
            res.json({ id: req.params.id, deleted: true });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MentorController(); 