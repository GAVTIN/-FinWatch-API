const Alert = require('../models/Alert');

const alertRepository = {
    findActiveByUser: (userId) =>
        Alert.find({ user: userId, active: true }),

    findAllActive: () =>
        Alert.find({ active: true, triggered: false }).populate('user', 'email'),

    create: (data) => Alert.create(data),

    findByIdAndUser: (id, userId) =>
        Alert.findOne({ _id: id, user: userId }),

    deleteByIdAndUser: (id, userId) =>
        Alert.findOneAndDelete({ _id: id, user: userId }),
};
module.exports = alertRepository;
