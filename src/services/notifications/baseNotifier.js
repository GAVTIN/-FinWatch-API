// Abstract base — enforces the send() contract (LSP from SOLID)
class BaseNotifier {
    async send(userId, event, payload) {
        throw new Error('send() must be implemented by subclass');
    }
}
module.exports = BaseNotifier;
