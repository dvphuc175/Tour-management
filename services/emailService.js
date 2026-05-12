const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log('[MAIL_CONFIG]', {
  user: EMAIL_USER || '(MISSING)',
  hasPass: !!EMAIL_PASS
});

// Chỉ khởi tạo transporter khi có credentials, tránh lỗi runtime
// (Lưu ý: trên Railway free tier, SMTP outbound bị block → mail sẽ fail
// với ETIMEDOUT. Local Gmail SMTP vẫn hoạt động bình thường.)
const transporter = (EMAIL_USER && EMAIL_PASS)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    })
  : null;

async function send({ to, subject, html, tag }) {
  if (!transporter) {
    console.warn(`[MAIL_SKIP] ${tag}: EMAIL_USER/EMAIL_PASS chưa set, bỏ qua gửi mail`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Vi Vu Việt Nam" <${EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[MAIL] ${tag} sent to ${to}`);
  } catch (err) {
    console.error(`[MAIL_ERROR] ${tag}:`, err.code || '', err.message);
  }
}

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

      await send({
        to: contactEmail,
        subject: `[Vi Vu Việt Nam] Xác nhận giữ chỗ đơn hàng #${booking.id}`,
        html,
        tag: 'Pending'
      });
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

      await send({
        to: contactEmail,
        subject: `[Vi Vu Việt Nam] Thanh toán thành công vé tour #${bookingId}`,
        html,
        tag: 'Success'
      });
    } catch (error) {
      console.error(`[MAIL_ERROR] Lỗi gửi email Success:`, error);
    }
  }
};

module.exports = EmailService;