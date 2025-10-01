const Mentor = require('../domain/MentorDomain');
const MentorRepo = require('../repositories/MentorRepo');

class MentorController {
    async create(req, res, next) {
        try {
            const mentor = new Mentor(req.body);
            const saved = await MentorRepo.create({ ...req.body, role: 'Mentor' });
            res.status(201).json(mentor);
        } catch (err) {
            // res.status(500).json({ message: 'Failed to register mentor', error: err.message });
            next(error);
        }
    }
    
    async getProfile(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (req.user.role !== 'Mentor') {
                return res.status(403).json({ message: 'Access denied: not a Mentor' });
            }

            const mentor = await MentorRepo.findById(req.user._id);
            if (!mentor) {
                return res.status(404).json({ message: 'Mentor not found' });
            }
            res.json(mentor);
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const mentors = await MentorRepo.findAll();
            res.json(mentors);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const mentor = await MentorRepo.findById(req.params.id);
            if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
            res.json(mentor);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            next(error);
        }
    }

    async addProgram(req, res) {
        try {
            const updatedMentor = await MentorRepo.addProgram(req.params.id, req.body.programId);
            res.json(updatedMentor);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            next(error);
        }   
    }

    async removeProgram(req, res) {
        try {
            const updatedMentor = await MentorRepo.removeProgram(req.params.id, req.body.programId);
            res.json(updatedMentor);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            next(error);
        }
    }
}

module.exports = new MentorController(); 