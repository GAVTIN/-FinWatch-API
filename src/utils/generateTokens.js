const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateTokens = (user) => {
    const payload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

module.exports = generateTokens;
