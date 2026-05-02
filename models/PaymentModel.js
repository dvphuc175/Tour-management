const { query } = require('../config/db');

const PaymentModel = {
  async findByBookingId(bookingId) {
    const rows = await query(
      'SELECT * FROM PAYMENTS WHERE booking_id = ? LIMIT 1',
      [bookingId]
    );
    return rows[0] || null;
  },

  // Cập nhật khi VNPay callback về (dành cho ca thất bại, ca thành công sẽ update bằng transaction bên Controller)
  async updateVnpay(bookingId, { status, transactionId, paidAt, method }) {
    return query(
      `UPDATE PAYMENTS
       SET status = ?, transaction_id = ?, paid_at = ?, method = ?
       WHERE booking_id = ?`,
      [status, transactionId || null, paidAt || null, method || 'vnpay', bookingId]
    );
  }
};

module.exports = PaymentModel;