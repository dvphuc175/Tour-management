const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const EmailService = {
  // Gửi email 1: Xác nhận giữ chỗ (Pending)
  async sendPendingEmail(booking, contactEmail) {
    try {
      const isVnpay = booking.payment_method === 'vnpay';
      const paymentMsg = isVnpay 
        ? `<p style="color:#d32f2f">Quý khách đã chọn thanh toán VNPay. Vui lòng hoàn tất thanh toán trong vòng 15 phút để hệ thống giữ chỗ.</p>`
        : `<p style="color:#0068ff">Quý khách đã chọn Tiền mặt. Vui lòng đến văn phòng thanh toán trong vòng 24h để hoàn tất đặt tour.</p>`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #0068ff; text-align: center;">Vi Vu Việt Nam - Xác nhận giữ chỗ</h2>
          <p>Xin chào <strong>${booking.contact_name}</strong>,</p>
          <p>Cảm ơn bạn đã đặt tour tại Vi Vu Việt Nam. Đơn hàng <strong>#${booking.id}</strong> của bạn đang ở trạng thái <strong>Chờ Xác Nhận</strong>.</p>
          ${paymentMsg}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(booking.total_price)}</p>
          <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ Zalo hoặc Hotline: 0345.xxx.xxx.</p>
        </div>
      `;

      await transporter.sendMail({
        from: '"Vi Vu Việt Nam" <' + process.env.EMAIL_USER + '>',
        to: contactEmail,
        subject: `[Vi Vu Việt Nam] Xác nhận giữ chỗ đơn hàng #${booking.id}`,
        html: html
      });
      console.log(`[MAIL] Đã gửi email Pending cho ${contactEmail}`);
    } catch (error) {
      console.error(`[MAIL_ERROR] Lỗi gửi email Pending:`, error);
    }
  },

  // Gửi email 2: Thanh toán thành công (Confirmed)
  async sendSuccessEmail(bookingId, contactEmail, contactName) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f8fff9;">
          <h2 style="color: #28a745; text-align: center;">🎉 Thanh toán thành công!</h2>
          <p>Xin chào <strong>${contactName}</strong>,</p>
          <p>Hệ thống đã ghi nhận thanh toán thành công cho đơn đặt tour <strong>#${bookingId}</strong>.</p>
          <p>Chỗ ngồi của bạn đã được đảm bảo 100%. Hướng dẫn viên sẽ liên hệ với bạn trước ngày khởi hành 1-2 ngày để dặn dò các thủ tục cần thiết.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p>Chúc bạn có một chuyến đi thật tuyệt vời cùng Vi Vu Việt Nam!</p>
        </div>
      `;

      await transporter.sendMail({
        from: '"Vi Vu Việt Nam" <' + process.env.EMAIL_USER + '>',
        to: contactEmail,
        subject: `[Vi Vu Việt Nam] Thanh toán thành công vé tour #${bookingId}`,
        html: html
      });
      console.log(`[MAIL] Đã gửi email Success cho ${contactEmail}`);
    } catch (error) {
      console.error(`[MAIL_ERROR] Lỗi gửi email Success:`, error);
    }
  }
};

module.exports = EmailService;