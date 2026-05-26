const Alert = require('../models/Alert');
const priceService = require('./priceService');
const { emitToUser } = require('../config/socket');
const logger = require('../config/logger');

// Checks all active alerts against current prices
const checkAlerts = async () => {
    const alerts = await Alert.find({ active: true, triggered: false })
        .populate('user', 'email');

    if (!alerts.length) return;

    // Group by symbol to avoid fetching the same price multiple times
    const symbols = [...new Set(alerts.map(a => a.symbol))];

    const prices = await Promise.allSettled(
        symbols.map(s => priceService.fetchPrice(s))
    );

    const priceMap = {};
    prices.forEach((result, i) => {
        if (result.status === 'fulfilled')
            priceMap[symbols[i]] = result.value.price;
    });

    // Evaluate each alert
    const triggered = alerts.filter(alert => {
        const current = priceMap[alert.symbol];
        if (!current) return false;
        return alert.condition === 'above'
            ? current >= alert.targetPrice
            : current <= alert.targetPrice;
    });

    // Fire and persist all triggered alerts
    await Promise.all(triggered.map(async (alert) => {
        alert.triggered = true;
        alert.triggeredAt = new Date();
        alert.active = false;
        await alert.save();

        // Emit real-time event to the user's private room
        emitToUser(alert.user._id.toString(), 'alert:triggered', {
            symbol: alert.symbol,
            condition: alert.condition,
            targetPrice: alert.targetPrice,
            triggeredAt: alert.triggeredAt,
            message: `${alert.symbol} is ${alert.condition} ${alert.targetPrice}`,
        });

        logger.info(`Alert triggered: ${alert.symbol} for user ${alert.user._id}`);
    }));
};

module.exports = { checkAlerts };
