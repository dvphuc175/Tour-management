const ActivityLogModel = require('../models/ActivityLogModel');

const AdminLogController = {
  // GET /admin/logs
  async index(req, res, next) {
    try {
      const action = req.query.action || null;
      const [logs, actions] = await Promise.all([
        ActivityLogModel.list({ limit: 200, action }),
        ActivityLogModel.distinctActions()
      ]);
      return res.render('admin/logs/index', {
        title: 'Nhật ký thao tác',
        logs,
        actions,
        currentAction: action,
        currentPath: req.path
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AdminLogController;
