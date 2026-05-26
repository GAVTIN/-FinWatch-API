const morgan = require('morgan');
const logger = require('../config/logger');

// Morgan writes HTTP logs through Winston
const stream = { write: (message) => logger.http(message.trim()) };

const requestLogger = morgan(
    ':method :url :status :res[content-length]B - :response-time ms',
    { stream }
);
module.exports = requestLogger;
