const Joi = require('joi');

const programSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
  description: Joi.string().allow(''),
  startDate: Joi.date().required(),
  endDate: Joi.date().required()
}).custom((value, helpers) => {
    if (value.startDate.getTime() >= value.endDate.getTime()) {
        return helpers.error("any.invalid", { 
            message: "Start date must be before end date" 
        });
    }
    return value;
}, "Program date validation");

function validateProgram(req, res, next) {
    const { error } = programSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ 
            error: "Validation failed",
            details: error.details.map((d) => d.message)
        });
    }
    next();
}

module.exports = validateProgram;