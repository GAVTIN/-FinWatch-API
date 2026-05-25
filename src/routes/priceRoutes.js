const router = require('express').Router();
const { getPrice, getBatchPrices } = require('../controllers/priceController');

router.get('/', getBatchPrices);   // GET /api/prices?symbols=AAPL,MSFT
router.get('/:symbol', getPrice);          // GET /api/prices/AAPL

module.exports = router;
