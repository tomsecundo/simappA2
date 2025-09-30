
const { User, Mentor } = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const{name, email, role, password, firstName, lastName, number, expertise, affiliation, address} = req.body;
    try {
        if (role === 'Mentor' || (firstName && lastName && number)) {
            if (!email || !password || !firstName || !lastName || !number) {
                return res.status(400).json({message: 'Missing required mentor fields'});
        }
        const mentorExists = await Mentor.findOne({email});
        if (mentorExists) return res.status(400).json ({message: 'User already exists'});
        
        const mentor = await Mentor.create ({
            role: 'Mentor',
            email,
            password,
            firstName,
            lastName,
            number,
            expertise,
            affiliation,
            address
        });
        return res.status(201).json({
            id: mentor.id,
            name: `${mentor.firstName} ${mentor.lastName}`,
            email: mentor.email,

            role: mentor.role,
            token: generateToken(mentor.id)
        });
    }
    const userExists = await User.findOne({email});
    if (userExists) return res.status(400).json({message:'User already exists'});

    const user = await User.create({ name, email, role, password });
    return res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            token: generateToken(user.id) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                token: generateToken(user.id) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };
