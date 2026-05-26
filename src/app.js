const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const priceRoutes = require('./routes/priceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();

// 1. Security headers — first, before anything touches the request
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 2. Body + cookie parsers — before ANY route or logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Compression + logging — after parsers, before routes
app.use(compression());
app.use(requestLogger);
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        // log it instead of setting a header after response is sent
        if (process.env.NODE_ENV === 'development') {
            require('./config/logger').http(`${req.method} ${req.originalUrl} — ${ms}ms`);
        }
    });
    next();
});

// 4. Routes
app.get('/health', (req, res) =>
    res.status(200).json({ status: 'ok', ts: Date.now() })
);
app.use('/api/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);

// 5. Error handler — must be last
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    const swaggerUi = require('swagger-ui-express');
    const swaggerSpec = require('./config/swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger UI: http://localhost:3000/api-docs');
}

module.exports = app;

// The exact order of middleware is important for security, logging and error handling to work correctly. The general flow is:
// Security(helmet, cors)
//   → Parsers(json, urlencoded, cookieParser)
//     → Utilities(compression, logger, response - time)
//       → Routes
//         → Error handler