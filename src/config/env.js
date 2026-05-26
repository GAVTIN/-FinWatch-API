const loadConfig = () => {
    const required = ['PORT', 'NODE_ENV', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
    // In production, MongoDB and Redis must be explicitly configured
    if (process.env.NODE_ENV === 'production') {
        required.push('MONGO_URI', 'ALLOWED_ORIGINS');
    }
    required.forEach(key => {
        if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
    });
    // Warn if weak secrets are used in production
    if (process.env.NODE_ENV === 'production') {
        if (process.env.JWT_SECRET?.length < 32)
            throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
    return Object.freeze({
        port: parseInt(process.env.PORT, 10) || 3000,
        nodeEnv: process.env.NODE_ENV,
        mongoUri: process.env.MONGO_URI || '',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
        jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret',
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        redisHost: process.env.REDIS_HOST || 'localhost',
        redisPort: process.env.REDIS_PORT || 6379,
        redisPassword: process.env.REDIS_PASSWORD || undefined,
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        logLevel: process.env.LOG_LEVEL || 'debug',
    });
};

module.exports = loadConfig();
