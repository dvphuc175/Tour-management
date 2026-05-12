const { query } = require('../config/db');

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

  async getAll({ limit = 20, offset = 0 } = {}) {
    const parsedLimit = Number(limit) || 20;
    const parsedOffset = Number(offset) || 0;
    return query(
      `SELECT id, fullname, email, phone, role, status, created_at 
       FROM USERS 
       ORDER BY created_at DESC 
       LIMIT ${parsedLimit} OFFSET ${parsedOffset}`
    );
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