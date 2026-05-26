const { pipeline } = require('stream/promises');  // handles errors + cleanup
const Portfolio = require('../models/Portfolio');
const CsvTransform = require('../utils/csvTransform');

const streamPortfolioCsv = async (userId, writableStream) => {
    const portfolio = await Portfolio.findOne({ user: userId }).lean();
    const holdings = portfolio?.holdings || [];

    if (holdings.length === 0) {
        writableStream.write('symbol,name,quantity,avgBuyPrice,assetType,createdAt\n');
        writableStream.write('No holdings found\n');
        return;
    }

    // Create a Readable from the holdings array
    const { Readable } = require('stream');
    const readable = Readable.from(holdings, { objectMode: true });
    const transform = new CsvTransform();

    // pipeline() automatically destroys streams on error
    // and calls end() on writableStream when readable is exhausted
    await pipeline(readable, transform, writableStream, { end: false });
};

module.exports = { streamPortfolioCsv };
