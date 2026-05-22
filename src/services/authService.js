const user = require('../models/User');
const generateTokens = require('../utils/generateTokens');
const AppError = require('../utils/AppError');

const register = async ({ name, email, password }) => {
    const exists = await user.findOne({ email });
    if (exists) throw new AppError('Email already in use', 400);
    const newUser = await user.create({ name, email, password });
    // password auto-hashed by pre-save hook
    const tokens = generateTokens(newUser._id, newUser.role);
    // Persist refresh token hash in DB
    await user.findByIdAndUpdate(newUser._id, { refreshToken: tokens.refreshToken });

    return { user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, ...tokens };
};

const login = async ({ email, password }) => {
    const user = await user.findOne({ email });
    if (!user) throw new AppError('Invalid email or password', 401);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);
    const tokens = generateTokens(user._id, user.role);
    // Update refresh token hash in DB
    await user.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

module.exports = { register, login };
