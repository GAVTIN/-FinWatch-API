const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./env');
const logger = require('./logger');

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
            credentials: true,
        },
        pingTimeout: 20000,
        pingInterval: 10000,
    });

    // Auth middleware — runs before connection is established
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) return next(new Error('Authentication required'));

        try {
            const payload = jwt.verify(token, config.jwtSecret);
            socket.userId = payload.sub;
            socket.role = payload.role;
            next();
        } catch {
            next(new Error('Invalid or expired token'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`WS connected: ${socket.userId}`);

        // Each user joins their own private room
        // Alerts are emitted to this room — only this user receives them
        socket.join(`user:${socket.userId}`);

        socket.on('subscribe:alerts', () => {
            socket.emit('subscribed', { message: 'Listening for price alerts' });
        });

        socket.on('disconnect', (reason) => {
            logger.info(`WS disconnected: ${socket.userId} — ${reason}`);
        });
    });

    return io;
};

// Called from alertChecker — emits to a specific user's room
const emitToUser = (userId, event, data) => {
    if (!io) return;
    io.to(`user:${userId}`).emit(event, data);
};

const getIO = () => io;

module.exports = { initSocket, emitToUser, getIO };
