const portfolioService = require('../services/portfolioService');
const asyncHandler = require('../utils/asyncHandler');

const getPortfolio = asyncHandler(async (req, res) => {
    const data = await portfolioService.getPortfolio(req.user.id);
    res.json({ status: 'success', data });
});

const addHolding = asyncHandler(async (req, res) => {
    const data = await portfolioService.addHolding(req.user.id, req.body);
    res.status(201).json({ status: 'success', data });
});

const updateHolding = asyncHandler(async (req, res) => {
    const data = await portfolioService.updateHolding(req.user.id, req.params.holdingId, req.body);
    res.json({ status: 'success', data });
});

const removeHolding = asyncHandler(async (req, res) => {
    await portfolioService.removeHolding(req.user.id, req.params.holdingId);
    res.status(204).send();
});

module.exports = { getPortfolio, addHolding, updateHolding, removeHolding };
