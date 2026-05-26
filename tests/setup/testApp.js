// Returns a clean Express app without starting a real server
require('dotenv').config({ path: '.env.test' });
const app = require('../../src/app');
module.exports = app;
