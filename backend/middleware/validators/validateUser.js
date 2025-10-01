const Joi = require("joi");

// Schema for registration
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name cannot exceed 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Valid email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    role: Joi.string().valid("Startup", "Mentor").required().messages({
        "any.only": "Role must be either 'startup' or 'mentor'",
        "any.required": "Role is required",
    }),
});

// Schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Valid email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

// Middleware for register validation
function validateRegister(req, res, next) {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message),
        });
    }
    next();
}

// Middleware for login validation
function validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message),
        });
    }
    next();
}

module.exports = { validateRegister, validateLogin };
