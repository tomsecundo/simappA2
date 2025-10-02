/**
 * Generic request validator middleware
 * @param {Joi.Schema} schema - Joi schema to validate against
 */
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.details.map((d) => d.message),
            });
        }
        next();
    };
};

module.exports = validateRequest;
