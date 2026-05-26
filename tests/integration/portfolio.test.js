const request = require('supertest');
const app = require('../setup/testApp');
const { loginTestUser } = require('../helpers/authHelper');

describe('Portfolio routes', () => {
    let token;

    beforeEach(async () => {
        ({ token } = await loginTestUser());
    });

    it('GET /api/portfolio returns 401 without token', async () => {
        const res = await request(app).get('/api/portfolio');
        expect(res.status).toBe(401);
    });

    it('GET /api/portfolio returns empty portfolio for new user', async () => {
        const res = await request(app)
            .get('/api/portfolio')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.holdings).toEqual([]);
    });

    it('POST /api/portfolio adds a holding', async () => {
        const res = await request(app)
            .post('/api/portfolio')
            .set('Authorization', `Bearer ${token}`)
            .send({ symbol: 'AAPL', quantity: 10, avgBuyPrice: 175, assetType: 'stock' });
        expect(res.status).toBe(201);
        expect(res.body.data.holdings).toHaveLength(1);
        expect(res.body.data.holdings[0].symbol).toBe('AAPL');
    });

    it('DELETE /api/portfolio/:id removes a holding', async () => {
        const add = await request(app)
            .post('/api/portfolio')
            .set('Authorization', `Bearer ${token}`)
            .send({ symbol: 'AAPL', quantity: 10, avgBuyPrice: 175, assetType: 'stock' });

        const holdingId = add.body.data.holdings[0]._id;
        const del = await request(app)
            .delete(`/api/portfolio/${holdingId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(204);
    });
});
