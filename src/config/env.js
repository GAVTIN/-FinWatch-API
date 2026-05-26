const loadConfig = () => {
    const required = ['PORT', 'NODE_ENV'];
    required.forEach(key => {
        if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
    });
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
