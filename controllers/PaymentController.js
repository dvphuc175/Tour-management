const { ProductCode, VnpLocale } = require('vnpay');
const vnpay        = require('../config/vnpay');
const PaymentModel = require('../models/PaymentModel');
const BookingModel = require('../models/BookingModel');
const { query, getConnection }    = require('../config/db');
const EmailService = require('../services/emailService');
const PaymentController = {

  // GET /payment/vnpay/:bookingId
  async createVnpay(req, res, next) {
    try {
      const booking = await BookingModel.findByIdAndUser(req.params.bookingId, req.session.user.id);

      if (!booking) {
        req.flash('error', 'Không tìm thấy đơn đặt');
        return res.redirect('/my-bookings');
      }
      if (booking.payment_status === 'success') {
        req.flash('error', 'Đơn này đã được thanh toán');
        return res.redirect(`/my-bookings/${booking.id}`);
      }
      if (booking.status !== 'pending' && booking.status !== 'confirmed') {
        req.flash('error', 'Đơn không hợp lệ để thanh toán');
        return res.redirect(`/my-bookings/${booking.id}`);
      }
      
      const amount = Math.round(Number(booking.total_price));
      
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount:      amount,
        vnp_IpAddr:      ipAddr, 
        
        vnp_TxnRef:      `${booking.id}_${Date.now()}`,
        
        vnp_OrderInfo:   `Thanh toan tour Booking ${booking.id}`, 
        vnp_OrderType:   'other',
        vnp_ReturnUrl:   process.env.VNPAY_RETURN_URL, 
        vnp_Locale:      VnpLocale.VN,
      });

      res.redirect(paymentUrl);
    } catch (err) { 
      next(err); 
    }
  },

  // GET /payment/vnpay/return 
  async vnpayReturn(req, res, next) {
    try {
      const txnRef    = req.query.vnp_TxnRef || '';
      
      const bookingId = txnRef.split('_')[0];

      if (!bookingId || !/^\d+$/.test(bookingId)) {
        return res.render('client/payment-result', { title: 'Kết quả thanh toán', success: false, message: 'Mã đơn hàng không hợp lệ' });
      }

      let verify;
      try {
        verify = vnpay.verifyReturnUrl(req.query);
      } catch (verifyErr) {
        return res.render('client/payment-result', {
          title: 'Thanh toán thất bại',
          success: false,
          message: 'Thông tin thanh toán không hợp lệ',
          bookingId
        });
      }

      if (!verify.isVerified || !verify.isSuccess) {
        const updateResult = await PaymentModel.updateVnpay(bookingId, {
          status: 'failed',
          transactionId: req.query.vnp_TransactionNo || null,
          paidAt: null, method: 'vnpay'
        });

        if (!updateResult.affectedRows) {
          return res.render('client/payment-result', {
            title: 'Thanh toán thất bại',
            success: false,
            message: 'Không tìm thấy đơn thanh toán',
            bookingId
          });
        }

        return res.render('client/payment-result', {
          title: 'Thanh toán thất bại', success: false,
          message: 'Giao dịch không thành công hoặc bị hủy', bookingId
        });
      }

      const conn = await getConnection();
      let contactEmail = '';
      let contactName = '';

      try {
        await conn.beginTransaction();

        const [bookingData] = await conn.execute(
          `SELECT 
             b.id,
             b.status,
             b.contact_email,
             b.contact_name,
             p.id AS payment_id
           FROM BOOKINGS b
           JOIN PAYMENTS p ON p.booking_id = b.id
           WHERE b.id = ?
           FOR UPDATE`,
          [bookingId]
        );

        if (!bookingData[0]) {
          await conn.rollback();
          return res.render('client/payment-result', {
            title: 'Thanh toán thất bại',
            success: false,
            message: 'Không tìm thấy đơn thanh toán',
            bookingId
          });
        }

        const [paymentResult] = await conn.execute(
          `UPDATE PAYMENTS SET status='success', method='vnpay', transaction_id=?, paid_at=NOW() WHERE booking_id=?`,
          [req.query.vnp_TransactionNo, bookingId]
        );

        if (!paymentResult.affectedRows) {
          throw new Error('Không thể cập nhật thanh toán');
        }

        await conn.execute(
          "UPDATE BOOKINGS SET status='confirmed' WHERE id=? AND status='pending'",
          [bookingId]
        );

        contactEmail = bookingData[0].contact_email;
        contactName = bookingData[0].contact_name;

        await conn.commit();
      } catch (dbErr) {
        await conn.rollback();
        throw dbErr;
      } finally {
        conn.release();
      }

      // BẮN EMAIL THÔNG BÁO THÀNH CÔNG (Không dùng await để khách chuyển trang ngay lập tức)
      if (contactEmail) {
        EmailService.sendSuccessEmail(bookingId, contactEmail, contactName).catch(console.error);
      }

      res.render('client/payment-result', {
        title: 'Thanh toán thành công', success: true,
        message: 'Đơn đặt tour của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!',
        bookingId, amount: req.query.vnp_Amount / 100
      });
    } catch (err) { 
      next(err); 
    }
  }
};

module.exports = PaymentController;
