const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/UserModel');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// register a user  
// role can be 'startup' or 'mentor'
// role cannot be changed after registration
const registerUser = async (req, res) => {
    // const{name, email, role, password, firstName, lastName, number, expertise, affiliation, address} = req.body;
    const{ name, email, role, password, university, address } = req.body;

    try {
        //     if (role === 'Mentor' || (firstName && lastName && number)) {
        //         if (!email || !password || !firstName || !lastName || !number) {
        //             return res.status(400).json({message: 'Missing required mentor fields'});
        //     }
        //     const mentorExists = await Mentor.findOne({email});
        //     if (mentorExists) return res.status(400).json ({message: 'User already exists'});
            
        //     const mentor = await Mentor.create ({
        //         role: 'Mentor',
        //         email,
        //         password,
        //         firstName,
        //         lastName,
        //         number,
        //         expertise,
        //         affiliation,
        //         address
        //     });
        //     return res.status(201).json({
        //         id: mentor.id,
        //         name: `${mentor.firstName} ${mentor.lastName}`,
        //         email: mentor.email,

        //         role: mentor.role,
        //         token: generateToken(mentor.id)
        //     });
        // }
        // const userExists = await User.findOne({email});
        // if (userExists) return res.status(400).json({message:'User already exists'});

        // const user = await User.create({ name, email, role, password });

        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await UserModel.create({ name, email, role, password,});

        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
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
        // let account = await Mentor.findOne({email});
        // if (!account) account = await User.findOne({email});
        // if (!account) return res.status(401).json({message: 'Invalid email or password'});
        
        // const ok = await bcrypt.compare(password, account.password);
        // if (!ok) return res.status(401).json({message:'Invalid email or password'});
        // const name = account.firstName
        //     ? `${account.firstName} ${account.lastName}`.trim()
        //     : account.name;

        // return res.json({ 
        //         id: account.id, 
        //         name, 
        //         email: account.email, 
        //         role: account.role,
        //         token: generateToken(account.id) 
        //     });

        const user = await UserModel.findOne({ email});
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