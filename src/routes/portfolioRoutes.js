const router = require('express').Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/portfolioController');
const validate = require('../middleware/validate');
const { holdingSchema } = require('../validators/portfolioValidator');

router.use(protect);   // all portfolio routes require auth

router.get('/', ctrl.getPortfolio);
router.post('/', validate(holdingSchema), ctrl.addHolding);
router.patch('/:holdingId', ctrl.updateHolding);
router.delete('/:holdingId', ctrl.removeHolding);

module.exports = router;
