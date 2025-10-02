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
const registerUser = async (req, res) => {
    const{name, email, role, password, number, expertise, affiliation, address, firstName, lastName, programs} = req.body;
    
    const fullName = name || `${firstName?.trim() || ''} ${lastName?.trim() || ''}`;
    try {
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userExists = await UserRepo.findByEmail(email);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        if (role === UserRole.MENTOR) {
            const mentor = new Mentor({
                name: fullName, 
                email, password, role,
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
        } else if (role === UserRole.STARTUP || role === UserRole.ADMIN) {
            const user = new User({ 
                name,
                email, 
                role, 
                password, 
                number: number || '',
                affiliation: affiliation || '', 
                address: address || '' 
            });

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

module.exports = { registerUser, loginUser };