const Portfolio = require('../models/Portfolio');
const AppError = require('../utils/AppError');

const getPortfolio = async (userId) => {
    const portfolio = await Portfolio.findOne({ user: userId });
    return portfolio || { user: userId, holdings: [] };
};

const addHolding = async (userId, holdingData) => {
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) portfolio = await Portfolio.create({ user: userId, holdings: [] });

    // If symbol already held, update avg price (weighted average)
    const existing = portfolio.holdings.find(h => h.symbol === holdingData.symbol.toUpperCase());
    if (existing) {
        const totalQty = existing.quantity + holdingData.quantity;
        const totalCost = (existing.quantity * existing.avgBuyPrice)
            + (holdingData.quantity * holdingData.avgBuyPrice);
        existing.quantity = totalQty;
        existing.avgBuyPrice = totalCost / totalQty;
    } else {
        portfolio.holdings.push(holdingData);
    }
    return portfolio.save();
};

const updateHolding = async (userId, holdingId, updates) => {
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    const holding = portfolio.holdings.id(holdingId);
    if (!holding) throw new AppError('Holding not found', 404);

    Object.assign(holding, updates);
    return portfolio.save();
};

const removeHolding = async (userId, holdingId) => {
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    portfolio.holdings = portfolio.holdings.filter(
        h => h._id.toString() !== holdingId
    );
    return portfolio.save();
};

module.exports = { getPortfolio, addHolding, updateHolding, removeHolding };
