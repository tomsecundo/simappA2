const Joi = require("joi");

const applicationSchema = Joi.object({
    applicationEmail: Joi.string().email().required().messages({
        "string.email": "Valid email is required",
        "any.required": "Email is required"
    }),
    applicationPhone: Joi.string().min(7).required().messages({
        "string.min": "Phone must have at least 7 digits",
        "any.required": "Phone is required"
    }),
    program: Joi.string().required().messages({
        "any.required": "Program is required"
    }),
    startupName: Joi.string().required().messages({
        "any.required": "Startup name is required"
    }),
    description: Joi.string().allow("")
});

function validateApplication(req, res, next) {
    const { error } = applicationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message)
        });
    }
    next();
}

module.exports = validateApplication;
