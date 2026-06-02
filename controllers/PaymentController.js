const {
  VnpLocale,
  IpnSuccess,
  IpnOrderNotFound,
  InpOrderAlreadyConfirmed,
  IpnInvalidAmount,
  IpnFailChecksum,
  IpnUnknownError
} = require('vnpay');
const vnpay = require('../config/vnpay');
const BookingModel = require('../models/BookingModel');
const { getConnection } = require('../config/db');
const EmailService = require('../services/emailService');

function getBookingIdFromTxnRef(txnRef = '') {
  const bookingId = String(txnRef).split('_')[0];
  return /^\d+$/.test(bookingId) ? Number(bookingId) : null;
}

function normalizeAmount(amount) {
  const numberValue = Number(amount);
  return Number.isFinite(numberValue) ? Math.round(numberValue) : null;
}

function sendSuccessEmailLater(result) {
  if (!result.emailContext) return;

  const { bookingId, contactEmail, contactName } = result.emailContext;
  EmailService.sendSuccessEmail(bookingId, contactEmail, contactName).catch(console.error);
}

async function processVnpayResult({ bookingId, amount, transactionNo, isSuccess }) {
  const conn = await getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      `SELECT
         b.id,
         b.status,
         b.contact_email,
         b.contact_name,
         b.total_price,
         p.id AS payment_id,
         p.amount AS payment_amount,
         p.status AS payment_status
       FROM BOOKINGS b
       JOIN PAYMENTS p ON p.booking_id = b.id
       WHERE b.id = ?
       FOR UPDATE`,
      [bookingId]
    );

    const booking = rows[0];

    if (!booking) {
      await conn.rollback();
      return { status: 'not_found' };
    }

    const expectedAmount = normalizeAmount(booking.payment_amount || booking.total_price);
    const receivedAmount = normalizeAmount(amount);

    if (expectedAmount === null || receivedAmount === null || expectedAmount !== receivedAmount) {
      await conn.rollback();
      return { status: 'invalid_amount' };
    }

    if (['success', 'refunded'].includes(booking.payment_status)) {
      await conn.commit();
      return { status: 'already_confirmed', booking };
    }

    if (!isSuccess) {
      await conn.execute(
        `UPDATE PAYMENTS
         SET status = 'failed',
             method = 'vnpay',
             transaction_id = ?,
             paid_at = NULL
         WHERE booking_id = ? AND status NOT IN ('success', 'refunded')`,
        [transactionNo || null, bookingId]
      );

      await conn.commit();
      return { status: 'failed', booking };
    }

    const [paymentResult] = await conn.execute(
      `UPDATE PAYMENTS
       SET status = 'success',
           method = 'vnpay',
           transaction_id = ?,
           paid_at = NOW()
       WHERE booking_id = ?`,
      [transactionNo || null, bookingId]
    );

    if (!paymentResult.affectedRows) {
      throw new Error('Không thể cập nhật thanh toán');
    }

    let confirmedBooking = false;

    if (booking.status === 'pending') {
      const [bookingResult] = await conn.execute(
        `UPDATE BOOKINGS
         SET status = 'confirmed'
         WHERE id = ? AND status = 'pending'`,
        [bookingId]
      );
      confirmedBooking = bookingResult.affectedRows > 0;
    }

    await conn.commit();

    const shouldSendEmail =
      ['pending', 'confirmed'].includes(booking.status) && booking.contact_email;

    return {
      status: confirmedBooking || booking.status === 'confirmed'
        ? 'confirmed'
        : 'paid_not_confirmed',
      booking,
      emailContext: shouldSendEmail
        ? {
            bookingId,
            contactEmail: booking.contact_email,
            contactName: booking.contact_name
          }
        : null
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

function renderPaymentFailure(res, message, bookingId) {
  return res.render('client/payment-result', {
    title: 'Thanh toán thất bại',
    success: false,
    message,
    bookingId
  });
}

function renderPaymentSuccess(res, message, bookingId, amount) {
  return res.render('client/payment-result', {
    title: 'Thanh toán thành công',
    success: true,
    message,
    bookingId,
    amount
  });
}

const PaymentController = {

  // GET /payment/vnpay/:bookingId
  async createVnpay(req, res, next) {
    try {
      const booking = await BookingModel.findByIdAndUser(req.params.bookingId, req.session.user.id);

      if (!booking) {
        req.flash('error', {
          title: 'Không tìm thấy đơn đặt',
          message: 'Đơn đặt này không tồn tại hoặc không thuộc tài khoản của bạn.',
          icon: 'warning'
        });
        return res.redirect('/my-bookings');
      }

      if (booking.payment_method !== 'vnpay') {
        req.flash('error', 'Đơn này không sử dụng phương thức thanh toán VNPay');
        return res.redirect(`/my-bookings/${booking.id}`);
      }

      if (booking.payment_status === 'success') {
        req.flash('info', {
          title: 'Đơn đã được thanh toán',
          message: `Đơn #${booking.id} đã ghi nhận thanh toán thành công trước đó.`,
          icon: 'info'
        });
        return res.redirect(`/my-bookings/${booking.id}`);
      }

      if (booking.status !== 'pending' && booking.status !== 'confirmed') {
        req.flash('error', {
          title: 'Không thể thanh toán đơn này',
          message: 'Đơn hiện không ở trạng thái phù hợp để thanh toán VNPay.',
          icon: 'warning'
        });
        return res.redirect(`/my-bookings/${booking.id}`);
      }

      const amount = Math.round(Number(booking.total_price));
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: ipAddr,
        vnp_TxnRef: `${booking.id}_${Date.now()}`,
        vnp_OrderInfo: `Thanh toan tour Booking ${booking.id}`,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
        vnp_Locale: VnpLocale.VN,
      });

      res.redirect(paymentUrl);
    } catch (err) {
      next(err);
    }
  },

  // GET /payment/vnpay/ipn
  async vnpayIpn(req, res) {
    try {
      let verify;

      try {
        verify = vnpay.verifyIpnCall(req.query);
      } catch (verifyErr) {
        return res.json(IpnFailChecksum);
      }

      if (!verify.isVerified) {
        return res.json(IpnFailChecksum);
      }

      const bookingId = getBookingIdFromTxnRef(verify.vnp_TxnRef);

      if (!bookingId) {
        return res.json(IpnOrderNotFound);
      }

      const result = await processVnpayResult({
        bookingId,
        amount: verify.vnp_Amount,
        transactionNo: verify.vnp_TransactionNo,
        isSuccess: verify.isSuccess
      });

      if (result.status === 'not_found') {
        return res.json(IpnOrderNotFound);
      }

      if (result.status === 'invalid_amount') {
        return res.json(IpnInvalidAmount);
      }

      if (result.status === 'already_confirmed') {
        return res.json(InpOrderAlreadyConfirmed);
      }

      sendSuccessEmailLater(result);
      return res.json(IpnSuccess);
    } catch (err) {
      console.error('[VNPAY_IPN_ERROR]', err);
      return res.json(IpnUnknownError);
    }
  },

  // GET /payment/vnpay/return
  async vnpayReturn(req, res, next) {
    try {
      let verify;

      try {
        verify = vnpay.verifyReturnUrl(req.query);
      } catch (verifyErr) {
        return renderPaymentFailure(res, 'Thông tin thanh toán không hợp lệ');
      }

      const bookingId = getBookingIdFromTxnRef(verify.vnp_TxnRef);

      if (!bookingId) {
        return renderPaymentFailure(res, 'Mã đơn hàng không hợp lệ');
      }

      if (!verify.isVerified) {
        return renderPaymentFailure(res, 'Thông tin thanh toán không hợp lệ', bookingId);
      }

      const result = await processVnpayResult({
        bookingId,
        amount: verify.vnp_Amount,
        transactionNo: verify.vnp_TransactionNo,
        isSuccess: verify.isSuccess
      });

      if (result.status === 'not_found') {
        return renderPaymentFailure(res, 'Không tìm thấy đơn thanh toán', bookingId);
      }

      if (result.status === 'invalid_amount') {
        return renderPaymentFailure(res, 'Số tiền thanh toán không khớp với đơn hàng', bookingId);
      }

      if (!verify.isSuccess && result.status !== 'already_confirmed') {
        return renderPaymentFailure(res, 'Giao dịch không thành công hoặc bị hủy', bookingId);
      }

      if (result.status === 'paid_not_confirmed') {
        return renderPaymentSuccess(
          res,
          'Thanh toán đã được ghi nhận, nhưng đơn không còn ở trạng thái chờ xác nhận. Vui lòng kiểm tra chi tiết đơn hoặc liên hệ quản trị viên.',
          bookingId,
          verify.vnp_Amount
        );
      }

      sendSuccessEmailLater(result);

      return renderPaymentSuccess(
        res,
        result.status === 'already_confirmed'
          ? 'Đơn đặt tour của bạn đã được thanh toán trước đó.'
          : 'Đơn đặt tour của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!',
        bookingId,
        verify.vnp_Amount
      );
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PaymentController;
