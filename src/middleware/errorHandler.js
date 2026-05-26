const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Only log 5xx as errors — 4xx are expected client mistakes
    if (statusCode >= 500) {
        logger.error(err.message, {
            stack: err.stack,
            method: req.method,
            url: req.originalUrl,
            userId: req.user?.id,
        });
    }

    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
