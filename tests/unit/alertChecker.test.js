const { checkAlerts } = require('../../src/services/alertChecker');
const ConsoleNotifier = require('../../src/services/notifications/consoleNotifier');

it('fires notifier when price crosses target', async () => {
    const mockNotifier = { send: jest.fn().mockResolvedValue({ sent: true }) };
    // inject mock — no real WebSocket, no real email
    await checkAlerts(mockNotifier);
    // assert on what matters
    expect(mockNotifier.send).toHaveBeenCalled();
});
