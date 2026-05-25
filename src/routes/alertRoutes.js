const router = require('express').Router();
const protect = require('../middleware/protect');
const ctrl = require('../controllers/alertController');

router.use(protect);
router.get('/', ctrl.getAlerts);
router.post('/', ctrl.createAlert);
router.delete('/:id', ctrl.deleteAlert);

module.exports = router;
