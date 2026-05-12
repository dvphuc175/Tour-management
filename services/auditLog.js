const ActivityLogModel = require('../models/ActivityLogModel');

// Ghi log thao tác. Lấy actor từ req.session.user. Không throw — chỉ console.error nếu lỗi.
async function logActivity(req, { action, targetType, targetId, metadata } = {}) {
  const user = req?.session?.user;
  return ActivityLogModel.create({
    actorId: user?.id ?? null,
    actorRole: user?.role ?? null,
    action,
    targetType,
    targetId,
    metadata
  });
}

module.exports = { logActivity };
