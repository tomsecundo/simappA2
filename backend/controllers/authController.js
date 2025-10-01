const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel, UserRole } = require('../models/UserModel');
const MentorModel = require('../models/MentorModel');
const UserRepo = require('../repositories/UserRepo');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// register a user  
// role can be 'startup' or 'mentor'
// role cannot be changed after registration
const registerUser = async (req, res) => {
    const{ 
        name, email, role, 
        password, firstName, lastName, 
        number, expertise, affiliation, 
        address, programs 
    } = req.body;

    try {

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userExists = await UserRepo.findByEmail(email);
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        let newUser;
    
        if (role === UserRole.MENTOR) {
            newUser = await MentorModel.create({
                name: firstName || name,
                firstName,
                lastName,
                number,
                email,
                role: UserRole.MENTOR,
                password,
                address,
                affiliation,
                expertise: expertise || '',
                programs: programs || [],
            });
        } else {
            newUser = await UserModel.create({
                name,
                email,
                role: UserRole.STARTUP,
                password,
            });
        }

        res.status(201).json({ 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email, 
            role: newUser.role, 
            expertise: newUser.expertise || null,
            programs: newUser.programs || [],
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ 
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
        res.status(500).json({ 
            message: 'Server error during login', 
            error: error.message,
        });
    }
};

module.exports = { registerUser, loginUser };