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
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
};

module.exports = loadConfig();
