const https = require('https');
const retryWithBackoff = require('../utils/retryWithBackoff');
const AppError = require('../utils/AppError');

// Low level fetch wrapper for Alpha Vantage API
const fetchJson = (url) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json['Error Message']) {
                    reject(new AppError('Invalid API call to Alpha Vantage', 400));
                } else if (json['Note']) {
                    reject(new AppError('Alpha Vantage API limit reached. Please try again later.', 503));
                } else {
                    resolve(json);
                }
            } catch (err) {
                reject(new AppError('Failed to parse response from Alpha Vantage', 500));
            }
        });
    }).on('error', err => reject(new AppError('Network error while fetching from Alpha Vantage', 500)));
});

const BASE = 'https://www.alphavantage.co/query';
const KEY = process.env.ALPHA_VANTAGE_KEY;

// Fetch single symbol price with retries
const fetchPrice = async (symbol) => {
    const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${KEY}`;
    const data = await retryWithBackoff(() => fetchJson(url));
    const quote = data['Global Quote'];
    if (!quote || !quote['05. price']) {
        throw new AppError(`Price data not found for symbol: ${symbol}`, 404);
    }
    return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        fetchedAt: new Date().toISOString()
    };
};

//fetch multiple symbols in parallel with retries
const fetchMultiplePrices = async (symbols) => Promise.all(symbols.map(s => fetchPrice(s)));

module.exports = {
    fetchPrice,
    fetchMultiplePrices
};
