const { query } = require('../config/db');

const ActivityLogModel = {
  // Ghi 1 log. Trả về insertId hoặc null nếu DB lỗi (không throw — audit log không được làm crash request chính).
  async create({ actorId, actorRole, action, targetType, targetId, metadata }) {
    try {
      const result = await query(
        `INSERT INTO ACTIVITY_LOGS
           (actor_id, actor_role, action, target_type, target_id, metadata)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          actorId ?? null,
          actorRole ?? null,
          action,
          targetType ?? null,
          targetId ?? null,
          metadata ? JSON.stringify(metadata) : null
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error('[ActivityLog] insert failed:', err.message);
      return null;
    }
  },

  // Liệt kê log có filter cơ bản
  async list({ limit = 100, offset = 0, action = null } = {}) {
    const parsedLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
    const parsedOffset = Math.max(Number(offset) || 0, 0);

    let sql = `
      SELECT l.id, l.actor_id, l.actor_role, l.action, l.target_type, l.target_id,
             l.metadata, l.created_at,
             u.fullname AS actor_name, u.email AS actor_email
      FROM ACTIVITY_LOGS l
      LEFT JOIN USERS u ON u.id = l.actor_id
      WHERE 1=1
    `;
    const params = [];
    if (action) {
      sql += ' AND l.action = ?';
      params.push(action);
    }
    sql += ` ORDER BY l.created_at DESC LIMIT ${parsedLimit} OFFSET ${parsedOffset}`;
    return query(sql, params);
  },

  async distinctActions() {
    return query(
      `SELECT DISTINCT action FROM ACTIVITY_LOGS ORDER BY action ASC`
    );
  }
};

module.exports = ActivityLogModel;
