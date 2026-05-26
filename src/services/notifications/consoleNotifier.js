const BaseNotifier = require('./baseNotifier');
const logger = require('../../config/logger');

class ConsoleNotifier extends BaseNotifier {
    async send(userId, event, payload) {
        logger.info(`[ConsoleNotifier] ${event} → user ${userId}`, payload);
        return { sent: true, channel: 'console' };
    }
}
module.exports = ConsoleNotifier;
