const AppError = require('../utils/AppError');

// Factory: returns a middleware for the specified roles
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role))
        throw new AppError('You do not have permission for this action', 403);
    next();
};

module.exports = restrictTo;

// Usage example in any route file:
// const protect    = require('../middleware/protect');
// const restrictTo = require('../middleware/restrictTo');
//
// router.get('/admin/users', protect, restrictTo('admin'), getAllUsers);
// router.get('/portfolio',   protect, getPortfolio);
//
// protect runs first — sets req.user
// restrictTo runs second — checks req.user.role
