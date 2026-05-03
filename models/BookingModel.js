const { query, getConnection } = require('../config/db');

const BookingModel = {
  /**
   * Tạo booking + xử lý slot + payment (transaction)
   */
  async createWithTransaction(data) {
    const conn = await getConnection();

    const {
      schedule_id,
      user_id,
      contact_name,
      contact_phone,
      contact_email,
      adult_count,
      child_count,
      total_price,
      special_request,
      payment_method
    } = data;

    const neededSlots = adult_count + child_count;

    try {
      await conn.beginTransaction();

      // 1. Lock schedule
      const [rows] = await conn.execute(
        `SELECT id, available_slots, status
         FROM TOUR_SCHEDULES
         WHERE id = ? AND status = 'active'
         FOR UPDATE`,
        [schedule_id]
      );

      const schedule = rows[0];

      if (!schedule) {
        throw new Error('Lịch trình không tồn tại hoặc đã bị hủy');
      }

      if (schedule.available_slots < neededSlots) {
        throw new Error(`Không đủ chỗ. Còn ${schedule.available_slots} chỗ`);
      }

      // 2. Tạo booking
      const [result] = await conn.execute(
        `INSERT INTO BOOKINGS (
          user_id,
          schedule_id,
          contact_name,
          contact_phone,
          contact_email,
          adult_count,
          child_count,
          total_price,
          special_request
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          schedule_id,
          contact_name,
          contact_phone,
          contact_email,
          adult_count,
          child_count,
          total_price,
          special_request || null
        ]
      );

      const bookingId = result.insertId;

      // 3. Trừ slot
      await conn.execute(
        `UPDATE TOUR_SCHEDULES
         SET available_slots = available_slots - ?
         WHERE id = ?`,
        [neededSlots, schedule_id]
      );

      // 4. Nếu hết chỗ → full
      await conn.execute(
        `UPDATE TOUR_SCHEDULES
         SET status = 'full'
         WHERE id = ? AND available_slots = 0`,
        [schedule_id]
      );

      // 5. Tạo payment (pending)
      await conn.execute(
        `INSERT INTO PAYMENTS (
          booking_id,
          amount,
          method,
          status
        ) VALUES (?, ?, ?, ?)`,
        [bookingId, total_price, payment_method, 'pending']
      );

      await conn.commit();
      return bookingId;

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /**
   * Lấy danh sách booking của user
   */
  async getByUserId(userId) {
    const sql = `
      SELECT 
        b.*,
        t.name AS tour_name,
        t.slug AS tour_slug,
        t.images AS tour_images,
        s.start_date,
        s.end_date,
        s.departure_location,
        p.status AS payment_status,
        p.method AS payment_method
      FROM BOOKINGS b
      JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
      JOIN TOURS t ON s.tour_id = t.id
      LEFT JOIN PAYMENTS p ON p.booking_id = b.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;

    return query(sql, [userId]);
  },

  // Chi tiết 1 booking
  async findByIdAndUser(bookingId, userId) {
    const sql = `
      SELECT 
        b.*,
        t.name AS tour_name,
        t.slug AS tour_slug,
        t.images AS tour_images,
        t.price_adult,
        t.price_child,
        s.start_date,
        s.end_date,
        s.departure_location,
        p.id AS payment_id,
        p.status AS payment_status,
        p.method AS payment_method,
        p.transaction_id,
        p.paid_at
      FROM BOOKINGS b
      JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
      JOIN TOURS t ON s.tour_id = t.id
      LEFT JOIN PAYMENTS p ON p.booking_id = b.id
      WHERE b.id = ? AND b.user_id = ?
      LIMIT 1
    `;

    const rows = await query(sql, [bookingId, userId]);
    const booking = rows[0];

    if (!booking) return null;

    try {
      booking.tour_images = JSON.parse(booking.tour_images || '[]');
    } catch {
      booking.tour_images = [];
    }

    return booking;
  },

  // User hủy booking

  async cancelByUser(bookingId, userId) {
    const conn = await getConnection();

    try {
      await conn.beginTransaction();

      // 1. Lock booking + schedule
      const [rows] = await conn.execute(
        `SELECT 
          b.id,
          b.status,
          b.adult_count,
          b.child_count,
          b.schedule_id,
          s.available_slots
        FROM BOOKINGS b
        JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
        WHERE b.id = ? AND b.user_id = ?
        FOR UPDATE`,
        [bookingId, userId]
      );

      const booking = rows[0];

      if (!booking) {
        throw new Error('Không tìm thấy đơn đặt');
      }

      if (booking.status !== 'pending') {
        throw new Error('Chỉ được hủy đơn đang chờ');
      }

      const returnSlots = booking.adult_count + booking.child_count;

      // 2. Cancel booking
      await conn.execute(
        `UPDATE BOOKINGS
         SET status = 'cancelled'
         WHERE id = ?`,
        [bookingId]
      );

      // 3. Trả slot
      await conn.execute(
        `UPDATE TOUR_SCHEDULES
         SET 
           available_slots = available_slots + ?,
           status = IF(status = 'full', 'active', status)
         WHERE id = ?`,
        [returnSlots, booking.schedule_id]
      );

      // 4. Cancel payment
      await conn.execute(
        `UPDATE PAYMENTS
         SET status = 'failed'
         WHERE booking_id = ? AND status = 'pending'`,
        [bookingId]
      );

      await conn.commit();

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
  // Job tự động hủy đơn VNPay treo quá 15 phút
  async autoCancelUnpaidVnpay() {
    const conn = await getConnection();
    try {
      await conn.beginTransaction();
      
      // Tìm các đơn vnpay, đang pending, tạo cách đây hơn 15 phút
      const [expired] = await conn.execute(
        `SELECT b.id, b.schedule_id, b.adult_count, b.child_count
         FROM BOOKINGS b
         JOIN PAYMENTS p ON p.booking_id = b.id
         WHERE b.status = 'pending' AND p.method = 'vnpay'
           AND b.created_at <= DATE_SUB(NOW(), INTERVAL 15 MINUTE)
         FOR UPDATE`
      );

      if (expired.length === 0) {
        await conn.rollback();
        return 0;
      }

      for (const b of expired) {
        // Đổi trạng thái đơn và thanh toán
        await conn.execute("UPDATE BOOKINGS SET status='cancelled' WHERE id=?", [b.id]);
        await conn.execute("UPDATE PAYMENTS SET status='failed' WHERE booking_id=?", [b.id]);
        
        // Trả lại slots cho lịch trình
        const returnSlots = b.adult_count + b.child_count;
        await conn.execute(
          `UPDATE TOUR_SCHEDULES
           SET available_slots = available_slots + ?,
               status = IF(status = 'full', 'active', status)
           WHERE id = ?`,
          [returnSlots, b.schedule_id]
        );
      }

      await conn.commit();
      return expired.length;
    } catch (err) {
      await conn.rollback();
      console.error('[DB_ERROR] Lỗi autoCancelUnpaidVnpay:', err);
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = BookingModel;