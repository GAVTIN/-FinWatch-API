const request = require('supertest');
const app = require('../setup/testApp');

describe('POST /api/auth/register', () => {
    it('returns 201 and tokens on valid input', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Gaurav', email: 'g@test.com', password: 'Password123' });

        expect(res.status).toBe(201);
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.headers['set-cookie']).toBeDefined();  // refresh cookie set
    });

    it('returns 409 on duplicate email', async () => {
        const user = { name: 'Test User', email: 'dup@test.com', password: 'Password123' };
        await request(app).post('/api/auth/register').send(user);
        const res = await request(app).post('/api/auth/register').send(user);
        expect(res.status).toBe(409);
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await request(app).post('/api/auth/register')
            .send({ name: 'Gaurav Singh', email: 'g@test.com', password: 'Password123' });
    });

    it('returns 200 and access token on valid credentials', async () => {
        const res = await request(app).post('/api/auth/login')
            .send({ email: 'g@test.com', password: 'Password123' });
        expect(res.status).toBe(200);
        expect(res.body.data.accessToken).toBeDefined();
    });

    it('returns 401 on wrong password', async () => {
        const res = await request(app).post('/api/auth/login')
            .send({ email: 'g@test.com', password: 'wrong' });
        expect(res.status).toBe(401);
    });
});
