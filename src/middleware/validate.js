const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

// Middleware factory: validate(schema) returns Express middleware
const validate = (schema) => (req, res, next) => {
    try {
        // parse() throws ZodError if validation fails
        // it also strips unknown fields — prevents mass assignment
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
            return next(new AppError(messages.join(', '), 400));
        }
        next(err);
    }
};
module.exports = validate;
