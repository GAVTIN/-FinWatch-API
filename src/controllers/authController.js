// src/controllers/authController.js — full corrected file
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Use authService.xxx — no destructuring, no name clash
const register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ status: 'success', data: { user, accessToken } });
});

const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ status: 'success', data: { user, accessToken } });
});

const refreshToken = asyncHandler(async (req, res) => {
    const incoming = req.cookies?.refreshToken;
    const tokens = await authService.refresh(incoming);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    res.json({ status: 'success', data: { accessToken: tokens.accessToken } });
});

const logoutUser = asyncHandler(async (req, res) => {
    const incoming = req.cookies?.refreshToken;
    if (incoming) {
        try {
            const payload = jwt.verify(incoming, config.jwtRefreshSecret);
            await authService.logout(payload.sub);
        } catch { /* token already invalid — still clear cookie */ }
    }
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ status: 'success', message: 'Logged out' });
});

module.exports = { register, login, refreshToken, logoutUser };
