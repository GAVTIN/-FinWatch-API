const BaseNotifier = require('./baseNotifier');
const { emitToUser } = require('../../config/socket');

class SocketNotifier extends BaseNotifier {
    async send(userId, event, payload) {
        emitToUser(userId.toString(), event, payload);
        return { sent: true, channel: 'websocket' };
    }
}
module.exports = SocketNotifier;
