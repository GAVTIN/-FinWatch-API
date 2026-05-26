const { connectTestDb, clearTestDb, closeTestDb } = require('./testDb');

beforeAll(async () => await connectTestDb());
afterEach(async () => await clearTestDb());   // clean slate between each test
afterAll(async () => await closeTestDb());

// tests/setup/testApp.js
// Returns a clean Express app without starting a real server
require('dotenv').config({ path: '.env.test' });
const app = require('../../src/app');
module.exports = app;
