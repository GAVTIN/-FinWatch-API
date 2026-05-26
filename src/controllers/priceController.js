const priceService = require('../services/priceService');
const asyncHandler = require('../utils/asyncHandler');

const getPrice = asyncHandler(async (req, res) => {
    const data = await priceService.fetchPrice(req.params.symbol.toUpperCase());
    res.set('X-Cache', data.cacheHit ? 'HIT' : 'MISS');
    res.json({ status: 'success', data });
});

const getBatchPrices = asyncHandler(async (req, res) => {
    const symbols = req.query.symbols?.split(',').map(s => s.trim().toUpperCase());
    if (!symbols?.length) throw new AppError('Provide ?symbols=AAPL,MSFT', 400);
    const data = await priceService.fetchMultiplePrices(symbols);
    res.json({ status: 'success', results: data.length, data });
});

module.exports = { getPrice, getBatchPrices };
