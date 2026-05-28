const { query, getConnection } = require('../config/db');
const EmailService = require('../services/emailService');
const AdminBookingController = {

  async index(req, res, next) {
    try {
      const status = req.query.status || null;
      const payment = req.query.payment || null;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = 10;
      const offset = (page - 1) * limit;

      let where = ' WHERE 1=1';
      const params = [];

      if (status) {
        where += ' AND b.status = ?';
        params.push(status);
      }

      if (payment) {
        where += ' AND p.status = ?';
        params.push(payment);
      }

      const baseFrom = `
        FROM BOOKINGS b
        JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
        JOIN TOURS t ON s.tour_id = t.id
        JOIN USERS u ON b.user_id = u.id
        LEFT JOIN PAYMENTS p ON p.booking_id = b.id
      `;

      const sql = `
        SELECT 
          b.*, 
          t.name AS tour_name, 
          s.start_date, 
          s.departure_location,
          u.fullname AS user_name, 
          u.email AS user_email,
          p.status AS payment_status, 
          p.method AS payment_method
        ${baseFrom}
        ${where}
        ORDER BY b.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const countSql = `SELECT COUNT(*) AS total ${baseFrom} ${where}`;

      const [bookings, countRows] = await Promise.all([
        query(sql, params),
        query(countSql, params)
      ]);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit) || 1;

      return res.render('admin/bookings/index', {
        title: 'Quản lý đơn đặt',
        bookings,
        currentStatus: status,
        currentPayment: payment,
        currentPage: page,
        totalPages
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
        req.flash('error', {
          title: 'Không tìm thấy đơn đặt',
          message: 'Đơn đặt này không tồn tại hoặc đã bị xóa.',
          icon: 'warning'
        });
        return res.redirect('/admin/bookings');
      }

      return res.render('admin/bookings/detail', {
        title: `Đơn #${booking.id}`,
        booking
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
        req.flash('info', {
          title: 'Đơn đã được hủy',
          message: `Đơn #${b.id} đã ở trạng thái hủy trước đó.`,
          icon: 'info'
        });
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      if (b.status === 'completed') {
        await conn.commit();
        req.flash('error', {
          title: 'Không thể hủy đơn',
          message: 'Đơn đã hoàn thành không thể chuyển sang trạng thái hủy.',
          icon: 'warning'
        });
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      const wasConfirmed = b.status === 'confirmed';

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

      // Payment đã thanh toán thành công -> đánh dấu 'refunded' (cần xử lý hoàn tiền thủ công)
      // Payment còn 'pending' -> 'failed'
      await conn.execute(
        `UPDATE PAYMENTS 
         SET status = CASE 
                        WHEN status = 'success' THEN 'refunded'
                        WHEN status = 'pending' THEN 'failed'
                        ELSE status
                      END
         WHERE booking_id = ?`,
        [b.id]
      );

      await conn.commit();

      if (b.contact_email) {
        EmailService.sendCancelledEmail(
          b.id, b.contact_email, b.contact_name, 'Admin hủy đơn'
        ).catch(console.error);
      }

      req.flash(
        'success',
        {
          title: 'Đã hủy đơn đặt',
          message: wasConfirmed
            ? 'Trạng thái thanh toán đã chuyển sang "Đã hoàn tiền". Vui lòng xử lý hoàn tiền thủ công cho khách.'
            : `Đơn #${b.id} đã được hủy và số chỗ đã được hoàn lại.`,
          icon: 'check'
        }
      );
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
        req.flash('error', {
          title: 'Không thể xác nhận đơn',
          message: 'Đơn không hợp lệ, không ở trạng thái chờ hoặc không phải thanh toán tiền mặt.',
          icon: 'warning'
        });
        return res.redirect(`/admin/bookings/${bookingId}`);
      }

      const bookingData = rows[0];

      await conn.execute("UPDATE BOOKINGS SET status='confirmed' WHERE id=?", [bookingId]);
      await conn.execute("UPDATE PAYMENTS SET status='success', paid_at=NOW() WHERE booking_id=?", [bookingId]);

      await conn.commit();
      if (bookingData.contact_email) {
        EmailService.sendSuccessEmail(bookingId, bookingData.contact_email, bookingData.contact_name).catch(console.error);
      }
      req.flash('success', {
        title: 'Đã xác nhận đơn',
        message: `Đơn #${bookingId} đã được xác nhận và ghi nhận thanh toán tiền mặt.`,
        icon: 'receipt'
      });
      res.redirect(`/admin/bookings/${bookingId}`);
    } catch (err) {
      await conn.rollback(); next(err);
    } finally { conn.release(); }
  },

  // PUT /admin/bookings/:id/complete 
  async complete(req, res, next) {
    try {
      const bookingId = req.params.id;

      const rows = await query(
        `SELECT b.status, b.contact_email, b.contact_name, s.start_date, s.end_date
         FROM BOOKINGS b
         JOIN TOUR_SCHEDULES s ON b.schedule_id = s.id
         WHERE b.id = ?`,
        [bookingId]
      );

      const bookingData = rows[0] || null;

      if (!bookingData) {
        req.flash('error', {
          title: 'Không tìm thấy đơn hàng',
          message: 'Đơn hàng này không tồn tại hoặc đã bị xóa.',
          icon: 'warning'
        });
        return res.redirect('/admin/bookings');
      }

      if (bookingData.status !== 'confirmed') {
        req.flash('error', {
          title: 'Không thể hoàn thành đơn',
          message: 'Chỉ có thể đánh dấu hoàn thành các đơn đã được xác nhận.',
          icon: 'warning'
        });
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      const now = new Date();
      const startDate = new Date(bookingData.start_date);

      if (now < startDate) {
        req.flash('error', {
          title: 'Tour chưa khởi hành',
          message: 'Không thể đánh dấu hoàn thành trước ngày khởi hành.',
          icon: 'warning'
        });
        return res.redirect(`/admin/bookings/${req.params.id}`);
      }

      await query("UPDATE BOOKINGS SET status = 'completed' WHERE id = ?", [bookingId]);

      if (rows[0].contact_email) {
        EmailService.sendCompletedEmail(
          bookingId, rows[0].contact_email, rows[0].contact_name
        ).catch(console.error);
      }

      req.flash('success', {
        title: 'Đã hoàn thành đơn',
        message: `Đơn #${bookingId} đã được đánh dấu hoàn thành.`,
        icon: 'check'
      });
      res.redirect(`/admin/bookings/${req.params.id}`);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AdminBookingController;