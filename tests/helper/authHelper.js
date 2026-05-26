const request = require('supertest');
const app = require('../setup/testApp');

// Registers + logs in a test user, returns { token, userId }
const loginTestUser = async (overrides = {}) => {
    const userData = {
        name: 'Test User',
        email: 'test@finwatch.com',
        password: 'Password123',
        ...overrides
    };
    await request(app).post('/api/auth/register').send(userData);
    const res = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: userData.password
    });
    return {
        token: res.body.data.accessToken,
        userId: res.body.data.user.id,
        cookie: res.headers['set-cookie'],
    };
};
module.exports = { loginTestUser };
