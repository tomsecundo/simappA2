const Joi = require('joi');

const AvailabilitySchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required()
}).custom((value, helpers) => {
    if (value.startDate.getTime() >= value.endDate.getTime()) {
        return helpers.error("any.invalid", { 
            message: "Start date must be before end date" 
        });
    }
    return value;
}, "Availability date validation");

function validateAvailability(req, res, next) {
    const { error } = AvailabilitySchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ 
            error: "Validation failed",
            details: error.details.map((d) => d.message)
        });
    }
    next();
}

module.exports = validateAvailability;