const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    condition: { type: String, enum: ['above', 'below'], required: true },
    targetPrice: { type: Number, required: true, min: 0 },
    triggered: { type: Boolean, default: false },
    triggeredAt: { type: Date },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
