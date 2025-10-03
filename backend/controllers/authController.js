const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserFactory = require('../domain/factory/UserFactory');
const UserRepo = require('../repositories/UserRepo');
const MentorRepo = require('../repositories/MentorRepo');
const { UserRole } = require('../models/UserModel');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/** Register a new user */
const registerUser = async (req, res) => {
    try {
        const {
            name, email, role, password,
            number, expertise, affiliation, address,
            firstName, lastName, programs,
        } = req.body;

        const fullName = name || `${firstName?.trim() || ''} ${lastName?.trim() || ''}`;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userExists = await UserRepo.findByEmail(email);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const userData = { 
            name: fullName, 
            email, 
            role, 
            password,
            number: number && number.trim() !== "" ? number : null,
            expertise, 
            affiliation, 
            address, 
            firstName, 
            lastName, 
            programs 
        };
        
        let saved;
        if (role === UserRole.MENTOR) {
            saved = await MentorRepo.create(userData);
        } else {
            saved = await UserRepo.create(userData);
        }
        
        const domainUser = UserFactory.createUser(saved.toObject());
        
        return res.status(201).json({
            id: domainUser.id,
            name: domainUser.name,
            email: domainUser.email,
            role: domainUser.role,
            token: generateToken(domainUser.id),
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Server error during registration',
            error: error.message
        });
    }
};

/** Login user */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserRepo.findByEmail(email);
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const domainUser = UserFactory.createUser(user.toObject());

        return res.json({ 
            id: domainUser.id,
            name: domainUser.name,
            email: domainUser.email,
            role: domainUser.role,
            token: generateToken(domainUser.id),
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error during login',
            error: error.message,
        });
    }
};

module.exports = { registerUser, loginUser };
