const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const priceRoutes = require('./routes/priceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const requestLogger = require('./middleware/requestLogger');

app.use(compression());          // gzip all responses > 1kb
app.use(requestLogger);
app.use((req, res, next) => {    // X-Response-Time header
    const start = Date.now();
    res.on('finish', () => res.set('X-Response-Time', `${Date.now() - start}ms`));
    next();
});
app.use(helmet());   // sets 11 security headers in one line
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    credentials: true,            // needed for cookies (refresh token)
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api/prices', priceRoutes);
app.use('/api/alerts', alertRoutes);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', ts: Date.now() });
});
module.exports = app;
