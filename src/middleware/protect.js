const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/env');

const protect = asyncHandler(async (req, res, next) => {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new AppError('Authentication required', 401);

    const token = authHeader.split(' ')[1];

    // 2. Verify signature and expiry
    let payload;
    try {
        payload = jwt.verify(token, config.jwtSecret);
    } catch (err) {
        const msg = err.name === 'TokenExpiredError'
            ? 'Access token expired' : 'Invalid access token';
        throw new AppError(msg, 401);
    }

    // 3. Confirm user still exists (e.g. account not deleted)
    const user = await User.findById(payload.sub);
    if (!user) throw new AppError('User no longer exists', 401);

    // 4. Attach to request — available in all downstream middleware
    req.user = { id: user._id, email: user.email, role: user.role };
    next();
});

module.exports = protect;
