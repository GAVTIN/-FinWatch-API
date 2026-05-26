require('dotenv').config();

const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/database');
const monitorEventLoop = require('./utils/eventLoopMonitor');
const http = require('http');
const { initSocket } = require('./config/socket');
const { checkAlerts } = require('./services/alertChecker');

// Create HTTP server manually — Socket.io needs the raw http.Server
const httpServer = http.createServer(app);
initSocket(httpServer);

// Poll for alert conditions every 60 seconds
const alertInterval = setInterval(checkAlerts, 60 * 1000);

const server = httpServer.listen(config.port, () =>
    console.log(`Worker ${process.pid} started on port ${config.port} [${config.nodeEnv}]`)
);

if (config.nodeEnv === 'development') monitorEventLoop(50);
connectDB();

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} already in use. Run: pm2 kill`);
        process.exit(1);
    } else throw err;
});

const shutdown = (signal) => {
    console.log(`${signal} — shutting down`);
    clearInterval(alertInterval);
    server.close(async () => {
        await require('mongoose').connection.close();
        logger.info('Server and MongoDB closed');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
