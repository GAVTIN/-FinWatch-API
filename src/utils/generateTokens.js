const jwt = require('jsonwebtoken');
const config = require('../config/env');
const crypto = require('crypto');

const generateTokens = (userId, role) => {
    const jti = crypto.randomBytes(16).toString('hex');
    const payload = { sub: userId, role, jti };
    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
    return { accessToken, refreshToken };
}

module.exports = generateTokens;
