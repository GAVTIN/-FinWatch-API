const alertService = require('../services/alertService');
const asyncHandler = require('../utils/asyncHandler');

const getAlerts = asyncHandler(async (req, res) => {
    const data = await alertService.getAlerts(req.user.id);
    res.json({ status: 'success', results: data.length, data });
});

const createAlert = asyncHandler(async (req, res) => {
    const data = await alertService.createAlert(req.user.id, req.body);
    res.status(201).json({ status: 'success', data });
});

const deleteAlert = asyncHandler(async (req, res) => {
    await alertService.deleteAlert(req.user.id, req.params.id);
    res.status(204).send();
});

module.exports = { getAlerts, createAlert, deleteAlert };
