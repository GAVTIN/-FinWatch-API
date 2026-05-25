const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const priceRoutes = require('./routes/priceRoutes');
const alertRoutes = require('./routes/alertRoutes');

app.use('/api/prices', priceRoutes);
app.use('/api/alerts', alertRoutes);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', ts: Date.now() });
});
module.exports = app;
