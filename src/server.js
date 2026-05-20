require('dotenv').config();

const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/database');
const monitorEventLoop = require('./utils/eventLoopMonitor');

if (config.nodeEnv === 'development') monitorEventLoop(50);

connectDB();

const server = app.listen(config.port, () =>
    console.log(`Worker ${process.pid} started on port ${config.port} [${config.nodeEnv}]`)
);

// ← ADD THIS RIGHT HERE, immediately after app.listen
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} is already in use. Is PM2 running? Run: pm2 kill`);
        process.exit(1);
    } else {
        throw err;
    }
});

const shutdown = (signal) => {
    console.log(`${signal} received — shutting down gracefully`);
    server.close(async () => {
        await require('mongoose').connection.close();
        console.log('HTTP server and MongoDB closed');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
