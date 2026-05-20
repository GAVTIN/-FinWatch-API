const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoUri, {
            serverSelectionTimeoutMS: 5000,   // 5 seconds timeout
        });
        console.log(`MongoDB connected ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

module.exports = connectDB;
