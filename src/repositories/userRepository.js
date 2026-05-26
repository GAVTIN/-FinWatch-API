const User = require('../models/User');

const userRepository = {
    findByEmail: (email) =>
        User.findOne({ email }),

    findByEmailWithPassword: (email) =>
        User.findOne({ email }).select('+password'),

    findById: (id) =>
        User.findById(id),

    findByIdWithRefreshToken: (id) =>
        User.findById(id).select('+refreshToken'),

    create: (data) =>
        User.create(data),

    updateRefreshToken: (id, token) =>
        User.findByIdAndUpdate(id, { refreshToken: token }, { new: true }),
};
module.exports = userRepository;
