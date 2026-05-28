const { query } = require('../config/db');

function buildUserFilters({ q = '', role = '', status = '' } = {}) {
  const conditions = [];
  const params = [];
  const keyword = String(q || '').trim();

  if (keyword) {
    conditions.push('(fullname LIKE ? OR email LIKE ? OR phone LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  return {
    where: conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '',
    params
  };
}

const UserModel = {
  // Tìm user theo email (dùng cho login)
  async findByEmail(email) {
    const rows = await query(
      'SELECT * FROM USERS WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  // Tìm user theo id (dùng sau login để load session)
  async findById(id) {
    const rows = await query(
      'SELECT id, fullname, email, phone, role, status FROM USERS WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  // Tạo user mới (register)
  async create({ fullname, email, password, phone }) {
    const result = await query(
      'INSERT INTO USERS (fullname, email, password, phone) VALUES (?, ?, ?, ?)',
      [fullname, email, password, phone || null]
    );
    return result.insertId;
  },

  async getAll({ limit = 20, offset = 0, q = '', role = '', status = '' } = {}) {
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);
    const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);
    const { where, params } = buildUserFilters({ q, role, status });

    return query(
      `SELECT id, fullname, email, phone, role, status, created_at 
       FROM USERS
       ${where}
       ORDER BY created_at DESC 
       LIMIT ${parsedLimit} OFFSET ${parsedOffset}`,
      params
    );
  },

  async countAll(filters = {}) {
    const { where, params } = buildUserFilters(filters);
    const rows = await query(`SELECT COUNT(*) AS total FROM USERS ${where}`, params);
    return rows[0].total;
  },

  // Admin: khóa / mở khóa tài khoản
  async toggleStatus(id) {
    return query(
      `UPDATE USERS
       SET status = IF(status = 'active', 'locked', 'active')
       WHERE id = ? AND role != 'admin'`,
      [id]
    );
  },
  
  async setRole(id, role) {
    const result = await query(
      `UPDATE USERS SET role = ? WHERE id = ?`,
      [role, id]
    );
    return result.affectedRows;
  }
};

module.exports = UserModel;
