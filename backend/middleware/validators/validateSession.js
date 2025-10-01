const Joi = require("joi");

const sessionSchema = Joi.object({
    applicationName: Joi.string().required().messages({
        "string.empty": "Application Name is required",
        "any.required": "Application Name is required"
    }),
    mentorfirstName: Joi.string().required().messages({
        "string.empty": "Mentor First Name is required",
        "any.required": "Mentor First Name is required"
    }),
    mentorlastName: Joi.string().required().messages({
        "string.empty": "Mentor Last Name is required",
        "any.required": "Mentor Last Name is required"
    }),
    sessionDate: Joi.date().iso().required().messages({
        "date.base": "Session date must be a valid date",
        "any.required": "Session date is required"
    }),
});

function validateSession(req, res, next) {
    const { error } = sessionSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message),
        });
    }
    next();
}

module.exports = validateSession;