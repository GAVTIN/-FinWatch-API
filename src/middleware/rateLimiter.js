const rateLimit = require('express-rate-limit');

// General API limiter — 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,    // returns RateLimit-* headers
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many requests, please try again later' },
});

// Strict limiter for auth routes — 10 attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { status: 'fail', message: 'Too many login attempts, try again in 15 minutes' },
});

module.exports = { apiLimiter, authLimiter };
