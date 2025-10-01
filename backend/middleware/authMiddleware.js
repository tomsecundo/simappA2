const jwt = require('jsonwebtoken');
const { User, Mentor } = require('../models/UserModel');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Token format invalid"});
        }

        const token = parts[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //reassignment
        let reassign = await User.findById(decoded.id).select('-password');
        if (!reassign) reassign = 
            await Mentor.findById(decoded.id).select('-password')
        ;

        if (!reassign) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = reassign;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Role-based access control
const hasRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: insufficient role" });
        }
        next();
    };
};


module.exports = { protect, hasRole };