const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    symbol: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0 },
    avgBuyPrice: { type: Number, required: true, min: 0 },
    assetType: { type: String, enum: ['stock', 'crypto'], default: 'stock' },
}, { timestamps: true });

const portfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    holdings: [holdingSchema],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
