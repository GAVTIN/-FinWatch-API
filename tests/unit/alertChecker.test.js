const { checkAlerts } = require('../../src/services/alertChecker');
const priceService = require('../../src/services/priceService');
const User = require('../../src/models/User');
const Alert = require('../../src/models/Alert');

jest.mock('../../src/services/priceService');

it('fires notifier when price crosses target', async () => {
    // Create a test user
    const user = await User.create({
        name: 'Alert Test User',
        email: 'alerttest@test.com',
        password: 'Password123'
    });

    // Create an active alert
    await Alert.create({
        user: user._id,
        symbol: 'AAPL',
        condition: 'above',
        targetPrice: 150,
        active: true
    });

    // Mock priceService to return a price that triggers the alert
    priceService.fetchPrice.mockResolvedValue({ price: 160 });

    const mockNotifier = { send: jest.fn().mockResolvedValue({ sent: true }) };
    
    // Call checkAlerts with mock notifier
    await checkAlerts(mockNotifier);
    
    // Assert the notifier was called
    expect(mockNotifier.send).toHaveBeenCalled();
    expect(mockNotifier.send).toHaveBeenCalledWith(
        user._id,
        'alert:triggered',
        expect.objectContaining({
            symbol: 'AAPL',
            condition: 'above',
            targetPrice: 150
        })
    );
});
