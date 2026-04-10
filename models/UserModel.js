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

  // Admin: lấy danh sách user (có phân trang)
  async getAll({ limit = 20, offset = 0 } = {}) {
    return query(
      'SELECT id, fullname, email, phone, role, status, created_at FROM USERS ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
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
  }
};

module.exports = UserModel;