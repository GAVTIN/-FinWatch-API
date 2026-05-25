const router = require('express').Router();
const { register, login, refreshToken, logoutUser } = require('../controllers/authController');

router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
