const { ProductCode, VnpLocale } = require('vnpay');
const vnpay        = require('../config/vnpay');
const PaymentModel = require('../models/PaymentModel');
const BookingModel = require('../models/BookingModel');
const { query, getConnection }    = require('../config/db');

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
      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount:      amount,
        vnp_IpAddr:      '127.0.0.1', 
        vnp_TxnRef:      `BOOKING_${booking.id}_${Date.now()}`,
        vnp_OrderInfo:   `Thanh toan tour Booking ${booking.id}`, 
        vnp_OrderType:   'other',
        vnp_ReturnUrl:   process.env.VNPAY_RETURN_URL, 
        vnp_Locale:      VnpLocale.VN,
      });

      res.redirect(paymentUrl);
    } catch (err) { next(err); }
  },

  // GET /payment/vnpay/return 
  async vnpayReturn(req, res, next) {
    try {
      const verify    = vnpay.verifyReturnUrl(req.query);
      const txnRef    = req.query.vnp_TxnRef || '';
      
      // Đã sửa lại thành split('_') để khớp với lúc tạo
      const bookingId = txnRef.split('_')[1];

      if (!bookingId) {
        return res.render('client/payment-result', { title: 'Kết quả thanh toán', success: false, message: 'Mã đơn hàng không hợp lệ' });
      }

      if (!verify.isVerified || !verify.isSuccess) {
        await PaymentModel.updateVnpay(bookingId, {
          status: 'failed',
          transactionId: req.query.vnp_TransactionNo || null,
          paidAt: null, method: 'vnpay'
        });
        return res.render('client/payment-result', {
          title: 'Thanh toán thất bại', success: false,
          message: 'Giao dịch không thành công hoặc bị hủy', bookingId
        });
      }

      // Thanh toán thành công — transaction
      const conn = await getConnection();
      try {
        await conn.beginTransaction();

        await conn.execute(
          `UPDATE PAYMENTS SET status='success', method='vnpay', transaction_id=?, paid_at=NOW() WHERE booking_id=?`,
          [req.query.vnp_TransactionNo, bookingId]
        );

        await conn.execute(
          "UPDATE BOOKINGS SET status='confirmed' WHERE id=? AND status='pending'",
          [bookingId]
        );

        await conn.commit();
      } catch (dbErr) {
        await conn.rollback();
        throw dbErr;
      } finally {
        conn.release();
      }

      res.render('client/payment-result', {
        title: 'Thanh toán thành công', success: true,
        message: 'Đơn đặt tour của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!',
        bookingId, amount: req.query.vnp_Amount / 100
      });
    } catch (err) { next(err); }
  }
};

module.exports = PaymentController;