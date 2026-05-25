const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { register, login, refresh, logout } = require('../services/authService');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

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
    const tokens = await refresh(incoming);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    res.json({ status: 'success', data: { accessToken: tokens.accessToken } });
});

const logoutUser = asyncHandler(async (req, res) => {
    const incoming = req.cookies?.refreshToken;
    if (incoming) {
        const payload = jwt.verify(incoming, config.jwtRefreshSecret);
        await logout(payload.sub);
    }
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ status: 'success', message: 'Logged out' });
});

module.exports = { register, login };
