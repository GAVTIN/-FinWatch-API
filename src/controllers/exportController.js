const exportService = require('../services/exportService');
const asyncHandler = require('../utils/asyncHandler');

const exportPortfolioCsv = asyncHandler(async (req, res) => {
    const filename = `portfolio-${req.user.id}-${Date.now()}.csv`;

    // Set headers BEFORE streaming starts — can't set them mid-stream
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Transfer-Encoding', 'chunked');  // no Content-Length needed

    await exportService.streamPortfolioCsv(req.user.id, res);
    res.end();
});

module.exports = { exportPortfolioCsv };
