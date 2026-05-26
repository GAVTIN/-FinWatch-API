require('dotenv').config({ path: '.env.test' });
const { connectTestDb, clearTestDb, closeTestDb } = require('./testDb');

beforeAll(async () => await connectTestDb());
afterEach(async () => await clearTestDb());   // clean slate between each test
afterAll(async () => await closeTestDb());
