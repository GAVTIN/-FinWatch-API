// src/services/alertService.js
const Alert = require('../models/Alert');
const AppError = require('../utils/AppError');

const getAlerts = (userId) => Alert.find({ user: userId, active: true });

const createAlert = (userId, body) =>
    Alert.create({ user: userId, ...body });

const deleteAlert = async (userId, alertId) => {
    const alert = await Alert.findOneAndDelete({ _id: alertId, user: userId });
    if (!alert) throw new AppError('Alert not found', 404);
};

module.exports = { getAlerts, createAlert, deleteAlert };
