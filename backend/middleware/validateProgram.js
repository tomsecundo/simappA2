const Joi = require("joi");

const programSchema = Joi.object({
    title: Joi.string().trim().min(3).required().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters long",
    }),
    description: Joi.string().allow(''),
    startDate: Joi.date().iso().required().messages({
        "date.base": "Start date must be a valid date",
        "any.required": "Start date is required"
    }),
    endDate: Joi.date().iso().required().messages({
        "date.base": "End date must be a valid date",
        "any.required": "End date is required"
    }),
}).custom((value, helpers) => {
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);

    if (start >= end) {
        // Trigger `any.invalid` with a clear message
        return helpers.error("any.invalid");
    }

    return value;
}, "Program date validation").messages({
    "any.invalid": "Start date must be before end date" // 👈 custom message
});

function validateProgram(req, res, next) {
    const { error } = programSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message),
        });
    }
    next();
}

module.exports = validateProgram;