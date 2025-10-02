const Joi = require('joi');

const mentorSchema = Joi.object({
    expertise: Joi.string().required(),
    affiliation: Joi.string().required(),
    bio: Joi.string().optional(),
});

function validateMentor(req, res, next) {
    const { error } = mentorSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message)
        });
    }
    next();
};

module.exports = validateMentor;
