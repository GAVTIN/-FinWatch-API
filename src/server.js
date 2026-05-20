require('dotenv').config();          // must be first line, before any other require

const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () =>
    console.log(`Worker ${process.pid} started on port ${config.port} [${config.nodeEnv}]`)
);

const shutdown = (signal) => {
    console.log(`${signal} received — shutting down gracefully`);
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
