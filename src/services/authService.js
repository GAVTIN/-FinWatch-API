const User = require('../models/User');
const generateTokens = require('../utils/generateTokens');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const register = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already registered', 409);
    const newUser = await User.create({ name, email, password });
    // password auto-hashed by pre-save hook
    const tokens = generateTokens(newUser._id, newUser.role);
    // Persist refresh token hash in DB
    await User.findByIdAndUpdate(newUser._id, { refreshToken: tokens.refreshToken });

    return { user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, ...tokens };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Invalid email or password', 401);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);
    const tokens = generateTokens(user._id, user.role);
    // Update refresh token hash in DB
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

const refresh = async (incomingRefreshToken) => {
    if (!incomingRefreshToken)
        throw new AppError('Refresh token missing', 401);

    // Verify the token is cryptographically valid
    let payload;
    try {
        payload = jwt.verify(incomingRefreshToken, config.jwtRefreshSecret);
    } catch {
        throw new AppError('Invalid or expired refresh token', 401);
    }

    // Check token matches what we stored (rotation check)
    const user = await User.findById(payload.sub).select('+refreshToken');
    if (!user || user.refreshToken !== incomingRefreshToken)
        throw new AppError('Refresh token reuse detected', 401);

    // Issue brand new token pair
    const tokens = generateTokens(user._id, user.role);

    // Overwrite stored token — old one is now dead
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

    return tokens;
};

const logout = async (userId) => {
    // Null out stored token — makes all refresh tokens for this user invalid
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = { register, login, refresh, logout };
