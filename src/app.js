const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', ts: Date.now() });
});
module.exports = app;
