const { query, getConnection } = require('../config/db');
const EmailService = require('../services/emailService');
const { logActivity } = require('../services/auditLog');
const AdminBookingController = {

  async index(req, res, next) {
    try {
      const status = req.query.status || null;

      let sql = `
        SELECT 
          b.*, 
          t.name AS tour_name, 
          s.start_date, 
          s.departure_location,
          u.fullname AS user_name, 
          u.email AS user_email,
          p.status AS payment_status, 
          p.method AS payment_method
        FROM BOOKINGS b
        JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
        JOIN TOURS t ON s.tour_id = t.id
        JOIN USERS u ON b.user_id = u.id
        LEFT JOIN PAYMENTS p ON p.booking_id = b.id
        WHERE 1=1
      `;

      const params = [];

      if (status) {
        sql += ' AND b.status = ?';
        params.push(status);
      }

      sql += ' ORDER BY b.created_at DESC';

      const bookings = await query(sql, params);

      return res.render('admin/bookings/index', {
        title: 'Quản lý đơn đặt',
        bookings,
        currentStatus: status,
        currentPath: req.path
      });

    } catch (err) {
      return next(err);
    }
  },

async detail(req, res, next) {
    try {
      const rows = await query(
        `
        SELECT 
          b.*, 
          t.name AS tour_name, 
          t.slug AS tour_slug,
          s.start_date, 
          s.end_date, 
          s.departure_location,
          u.fullname AS user_name, 
          u.email AS user_email, 
          u.phone AS user_phone,
          p.id AS payment_id,
          p.status AS payment_status, 
          p.method AS payment_method,
          p.transaction_id, 
          p.paid_at, 
          p.amount
        FROM BOOKINGS b
        JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
        JOIN TOURS t ON s.tour_id = t.id
        JOIN USERS u ON b.user_id = u.id
        LEFT JOIN PAYMENTS p ON p.booking_id = b.id
        WHERE b.id = ?
        LIMIT 1
        `,
        [req.params.id]
      );

      const booking = rows[0];

      if (!booking) {
        req.flash('error', 'Không tìm thấy đơn đặt');
        return res.redirect('/admin/bookings');
      }

      return res.render('admin/bookings/detail', {
        title: `Đơn #${booking.id}`,
        booking,
        currentPath: req.path
      });

    } catch (err) {
      return next(err);
    }
  },


  // PUT /admin/bookings/:id/cancel
  async cancel(req, res, next) {
    const conn = await getConnection();

    try {
      await conn.beginTransaction();

      const [rows] = await conn.execute(
        `SELECT * FROM BOOKINGS WHERE id = ? FOR UPDATE`,
        [req.params.id]
      );

      const b = rows[0];

      if (!b) {
        throw new Error('Booking không tồn tại');
      }

      if (b.status === 'cancelled') {
        await conn.commit();
        req.flash('info', 'Đơn đã được hủy trước đó');
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      if (b.status === 'confirmed') {
      }

      await conn.execute(
        `UPDATE BOOKINGS SET status = 'cancelled' WHERE id = ?`,
        [b.id]
      );

      await conn.execute(
        `UPDATE TOUR_SCHEDULES 
         SET available_slots = available_slots + ?,
             status = IF(status = 'full', 'active', status)
         WHERE id = ?`,
        [b.adult_count + b.child_count, b.schedule_id]
      );

      await conn.execute(
        `UPDATE PAYMENTS 
         SET status = 'failed'
         WHERE booking_id = ? AND status = 'pending'`,
        [b.id]
      );

      await conn.commit();

      await logActivity(req, {
        action: 'booking.cancel',
        targetType: 'booking',
        targetId: Number(req.params.id)
      });

      req.flash('success', 'Đã hủy đơn đặt');
      return res.redirect(`/admin/bookings/${req.params.id}`);

    } catch (err) {
      await conn.rollback();
      return next(err);
    } finally {
      conn.release();
    }
  },
  // PUT /admin/bookings/:id/confirm  — CHỈ dùng cho Cash
  async confirm(req, res, next) {
    const conn = await getConnection();
    const bookingId = req.params.id;
    try {
      await conn.beginTransaction();

      const [rows] = await conn.execute(
        `SELECT b.id, b.contact_email, b.contact_name FROM BOOKINGS b
         JOIN PAYMENTS p ON p.booking_id = b.id
         WHERE b.id = ? AND b.status = 'pending' AND p.method = 'cash'
         LIMIT 1`, [bookingId]
      );
      if (!rows[0]) {
        await conn.rollback();
        req.flash('error', 'Không thể xác nhận: đơn không hợp lệ hoặc không phải thanh toán tiền mặt');
        return res.redirect(`/admin/bookings/${bookingId}`);
      }

      const bookingData = rows[0];

      await conn.execute("UPDATE BOOKINGS SET status='confirmed' WHERE id=?", [bookingId]);
      await conn.execute("UPDATE PAYMENTS SET status='success', paid_at=NOW() WHERE booking_id=?", [bookingId]);

      await conn.commit();

      await logActivity(req, {
        action: 'booking.confirm',
        targetType: 'booking',
        targetId: Number(bookingId),
        metadata: { payment_method: 'cash' }
      });

      if (bookingData.contact_email) {
        EmailService.sendSuccessEmail(bookingId, bookingData.contact_email, bookingData.contact_name).catch(console.error);
      }
      req.flash('success', 'Đã xác nhận đơn và ghi nhận thanh toán tiền mặt');
      res.redirect(`/admin/bookings/${bookingId}`);
    } catch (err) {
      await conn.rollback(); next(err);
    } finally { conn.release(); }
  },

  // PUT /admin/bookings/:id/complete 
  async complete(req, res, next) {
    try {
      const bookingId = req.params.id;

      const result = await query(
        `SELECT b.status, s.start_date, s.end_date 
         FROM BOOKINGS b
         JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
         WHERE b.id = ?`,
        [bookingId]
      );

      const rows = Array.isArray(result[0]) ? result[0] : result;
      const bookingData = rows && rows.length > 0 ? rows[0] : null;

      if (!bookingData) {
        req.flash('error', 'Không tìm thấy đơn hàng.');
        return res.redirect('/admin/bookings');
      }

      if (bookingData.status !== 'confirmed') {
        req.flash('error', 'Chỉ có thể hoàn thành các đơn đã được xác nhận.');
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      const now = new Date();
      const startDate = new Date(bookingData.start_date);

      if (now < startDate) {
        req.flash('error', 'Tour này chưa khởi hành! Không thể đánh dấu hoàn thành sớm.');
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      await query("UPDATE BOOKINGS SET status = 'completed' WHERE id = ?", [bookingId]);

      await logActivity(req, {
        action: 'booking.complete',
        targetType: 'booking',
        targetId: Number(bookingId)
      });

      req.flash('success', 'Đã đánh dấu hoàn thành đơn đặt tour!');
      res.redirect(`/admin/bookings/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AdminBookingController;