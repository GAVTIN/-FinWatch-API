const alertRepository = require('../repositories/alertRepository');
const priceService = require('./priceService');
const SocketNotifier = require('./notifications/socketNotifier');
const logger = require('../config/logger');

// notifier is injected — swap ConsoleNotifier in tests, SocketNotifier in prod
const checkAlerts = async (notifier = new SocketNotifier()) => {
    const alerts = await alertRepository.findAllActive();
    if (!alerts.length) return;

    const symbols = [...new Set(alerts.map(a => a.symbol))];
    const prices = await Promise.allSettled(symbols.map(s => priceService.fetchPrice(s)));
    const priceMap = {};
    prices.forEach((r, i) => {
        if (r.status === 'fulfilled') priceMap[symbols[i]] = r.value.price;
    });

    const triggered = alerts.filter(a => {
        const p = priceMap[a.symbol];
        if (!p) return false;
        return a.condition === 'above' ? p >= a.targetPrice : p <= a.targetPrice;
    });

    await Promise.all(triggered.map(async (alert) => {
        alert.triggered = true;
        alert.triggeredAt = new Date();
        alert.active = false;
        await alert.save();

        await notifier.send(alert.user._id, 'alert:triggered', {
            symbol: alert.symbol,
            condition: alert.condition,
            targetPrice: alert.targetPrice,
            triggeredAt: alert.triggeredAt,
        });

        logger.info(`Alert triggered: ${alert.symbol}`, { userId: alert.user._id });
    }));
};

module.exports = { checkAlerts };
