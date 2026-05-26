class CsvTransform extends Transform {
    constructor(options = {}) {
        super({ ...options, objectMode: true });  // input: objects, output: strings
        this._headerWritten = false;
    }

    _transform(holding, encoding, callback) {
        try {
            // Write header row on first chunk only
            if (!this._headerWritten) {
                this.push('symbol,name,quantity,avgBuyPrice,assetType,createdAt\n');
                this._headerWritten = true;
            }
            // Sanitise each field — commas inside values would break CSV
            const row = [
                holding.symbol,
                `"${(holding.name || '').replace(/"/g, '""')}"`,
                holding.quantity,
                holding.avgBuyPrice,
                holding.assetType,
                new Date(holding.createdAt).toISOString(),
            ].join(',');
            this.push(row + '\n');
            callback();
        } catch (err) {
            callback(err);
        }
    }

    _flush(callback) {
        // Called when all input is consumed — good place for footers
        callback();
    }
}
module.exports = CsvTransform;
