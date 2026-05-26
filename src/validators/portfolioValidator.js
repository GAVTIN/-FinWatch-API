const { z } = require('zod');

const holdingSchema = z.object({
    symbol: z.string().min(1).max(10).trim().toUpperCase(),
    name: z.string().max(100).optional().default(''),
    quantity: z.number().positive(),
    avgBuyPrice: z.number().positive(),
    assetType: z.enum(['stock', 'crypto']).default('stock'),
});

module.exports = { holdingSchema };
