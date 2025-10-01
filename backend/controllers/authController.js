const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../domain/UserDomain');
const Mentor = require('../domain/MentorDomain');

const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserRole } = require('../models/UserModel');

// const { UserModel } = require('../models/UserModel');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// register a user  
// role can be 'startup' or 'mentor'
const registerUser = async (req, res) => {
    const{name, email, role, password, firstName, lastName, number, expertise, affiliation, address, programs} = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(400).json({ message: "Missing required inputs"});
        }

        const userExists = await UserRepo.findByEmail(email);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        if (role === UserRole.MENTOR) {
            const mentorName = `${firstName.trim()} ${lastName.trim()}`;
            const mentor = new Mentor({
                name: mentorName, 
                email, password, 
                role: UserRole.MENTOR,
                firstName, 
                lastName, 
                number: number || '', 
                expertise: expertise || '',
                affiliation: affiliation || '', 
                address: address || '', 
                programs: programs || [],
            });
            const saveMentor = await MentorRepo.create(mentor);
            
            return res.status(201).json({
                id: saveMentor.id,
                name: saveMentor.name,
                email: saveMentor.email,
                role: saveMentor.role,
                token: generateToken(saveMentor.id),
            });
        } else if (role === UserRole.STARTUP) {
            const user = new User({ name, email, role: UserRole.STARTUP, password });
            const saveUser = await UserRepo.create(user);

            return res.status(201).json({
                id: saveUser.id,
                name: saveUser.name,
                email: saveUser.email,
                role: saveUser.role,
                token: generateToken(saveUser.id),
            });
        } else {
            return res.status(400).json({ message: "Invalid role."});
        }
    } catch (error) {
        return res.status(500).json({ 
            message: 'Server error during registration', 
            error: error.message 
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserRepo.findByEmail(email);
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        return res.json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            token: generateToken(user.id) 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Server error during login', 
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });

        res.json({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            ...(req.user.role === UserRole.MENTOR ? {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                expertise: req.user.expertise,
                affiliation: req.user.affiliation,
            } : {})
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { registerUser, loginUser, getProfile };