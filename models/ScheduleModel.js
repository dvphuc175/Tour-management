const { query } = require('../config/db');

const ScheduleModel = {
  // Lấy tất cả lịch trình của 1 tour
  async getByTourId(tourId) {
    return query(
      `SELECT *
       FROM TOUR_SCHEDULES
       WHERE tour_id = ?
       ORDER BY start_date ASC`,
      [tourId]
    );
  },

  async findById(id) {
    const rows = await query(
      `SELECT 
         s.*, 
         t.name AS tour_name, 
         t.price_adult, 
         t.price_child
       FROM TOUR_SCHEDULES s
       JOIN TOURS t ON s.tour_id = t.id
       WHERE s.id = ?
       LIMIT 1`,
      [id]
    );

    return rows[0] || null;
  },

  async create({
    tour_id,
    departure_location,
    start_date,
    end_date,
    total_slots
  }) {
    const result = await query(
      `INSERT INTO TOUR_SCHEDULES
       (tour_id, departure_location, start_date, end_date, total_slots, available_slots)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        tour_id,
        departure_location,
        start_date,
        end_date,
        total_slots,
        total_slots // available_slots = total_slots khi mới tạo
      ]
    );

    return result.insertId;
  },

  async update(id, { departure_location, start_date, end_date, total_slots, available_slots, status }) {
    return query(
      `UPDATE TOUR_SCHEDULES
       SET departure_location=?, start_date=?, end_date=?, total_slots=?, available_slots=?, status=?
       WHERE id=?`,
      [departure_location, start_date, end_date, total_slots, available_slots, status, id]
    );
  },

  async delete(id) {
    // Chỉ cho xóa nếu không có booking nào
    const booked = await query(
      `SELECT COUNT(*) AS cnt
       FROM BOOKINGS
       WHERE schedule_id = ?
         AND status != 'cancelled'`,
      [id]
    );

    if (booked[0].cnt > 0) {
      throw new Error('Không thể xóa lịch trình đã có đặt chỗ');
    }

    return query(
      'DELETE FROM TOUR_SCHEDULES WHERE id = ?',
      [id]
    );
  },
  async getAvailableByTourId(tourId) 
  { 
    return query( 
      `SELECT * 
      FROM TOUR_SCHEDULES
      WHERE tour_id = ? AND status = 'active' AND start_date >= CURDATE()
      ORDER BY start_date ASC`, 
      [tourId] ); }
};

module.exports = ScheduleModel;