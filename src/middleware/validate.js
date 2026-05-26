const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

// Middleware factory: validate(schema) returns Express middleware
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        // use err.issues — works across all Zod versions
        if (err?.issues || err?.name === 'ZodError') {
            const messages = (err.issues || err.errors || [])
                .map(e => `${e.path.join('.') || 'field'}: ${e.message}`)
                .join(', ');
            return next(new AppError(messages || 'Validation failed', 400));
        }
        next(err);
    }
};

module.exports = validate;
