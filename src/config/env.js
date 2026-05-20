const loadConfig = () => {
    const required = ['PORT', 'NODE_ENV'];
    required.forEach(key => {
        if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
    });
    return Object.freeze({
        port: parseInt(process.env.PORT, 10) || 3000,
        nodeEnv: process.env.NODE_ENV,
        mongoUri: process.env.MONGO_URI || '',
    });
};

module.exports = loadConfig();
