const jwt = require('jsonwebtoken');
const { User, UserRole } = require('../models/UserModel');

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

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Middleware to check for admin role
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === UserRole.ADMIN) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin only' });
    }
};

module.exports = { protect, adminOnly };