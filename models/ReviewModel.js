const { query } = require('../config/db');

const ReviewModel = {
  // Lấy danh sách review theo tour
  async getByTourId(tourId) {
    return query(
      `
      SELECT 
        r.*, 
        u.fullname AS user_name
      FROM REVIEWS r
      JOIN USERS u ON r.user_id = u.id
      WHERE r.tour_id = ?
      ORDER BY r.created_at DESC
      `,
      [tourId]
    );
  },

  // Lấy điểm đánh giá trung bình
  async getAvgRating(tourId) {
    const rows = await query(
      `
      SELECT 
        ROUND(AVG(rating), 1) AS avg_rating,
        COUNT(*) AS total
      FROM REVIEWS
      WHERE tour_id = ?
      `,
      [tourId]
    );

    return rows[0];
  },

  // Kiểm tra user đã review tour chưa
  async hasReviewed(userId, tourId) {
    const rows = await query(
      `
      SELECT id
      FROM REVIEWS
      WHERE user_id = ? AND tour_id = ?
      LIMIT 1
      `,
      [userId, tourId]
    );

    return rows.length > 0;
  },

  // Kiểm tra user đã hoàn thành booking của tour chưa
  async hasCompletedBooking(userId, tourId) {
    const rows = await query(
      `
      SELECT b.id
      FROM BOOKINGS b
      JOIN TOUR_SCHEDULES s 
        ON b.schedule_id = s.id
      WHERE b.user_id = ?
        AND s.tour_id = ?
        AND b.status = 'completed'
      LIMIT 1
      `,
      [userId, tourId]
    );

    return rows.length > 0;
  },

  // Tạo review mới
  async create({ tour_id, user_id, rating, comment }) {
    const result = await query(
      `
      INSERT INTO REVIEWS (tour_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
      `,
      [tour_id, user_id, rating, comment || null]
    );

    return result.insertId;
  },

  // Lấy tất cả review
  async getAll({ limit = null, offset = 0 } = {}) {
    let sql = `
      SELECT 
        r.*,
        u.fullname AS user_name,
        t.name AS tour_name
      FROM REVIEWS r
      JOIN USERS u 
        ON r.user_id = u.id
      JOIN TOURS t 
        ON r.tour_id = t.id
      ORDER BY r.created_at DESC
    `;
    if (limit !== null) {
      sql += ` LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
    }
    return query(sql);
  },

  async countAll() {
    const rows = await query(`SELECT COUNT(*) AS total FROM REVIEWS`);
    return rows[0].total;
  },

  // Xóa review
  async delete(id) {
    return query(
      `
      DELETE FROM REVIEWS
      WHERE id = ?
      `,
      [id]
    );
  }
};

module.exports = ReviewModel;