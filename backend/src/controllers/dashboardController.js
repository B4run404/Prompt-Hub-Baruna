const dashboardService = require('../services/dashboardService');

const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getStats(req.user.id);
        res.status(200).json({ status: 'success', data: stats });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDashboardStats };
