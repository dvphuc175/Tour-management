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
  },

  // Gửi email 3: Hủy đơn (Cancelled)
  async sendCancelledEmail(bookingId, contactEmail, contactName, reason = '') {
    try {
      const reasonHtml = reason
        ? `<p><strong>Lý do hủy:</strong> ${reason}</p>`
        : '';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #fff8f8;">
          <h2 style="color: #dc3545; text-align: center;">Đơn đặt tour đã bị hủy</h2>
          <p>Xin chào <strong>${contactName}</strong>,</p>
          <p>Đơn đặt tour <strong>#${bookingId}</strong> của bạn đã bị <strong>hủy</strong>.</p>
          ${reasonHtml}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p>Nếu bạn có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ Zalo hoặc Hotline: 0345.xxx.xxx.</p>
          <p style="color: #888; font-size: 12px;">Vi Vu Việt Nam rất tiếc vì sự bất tiện này và hy vọng được phục vụ bạn trong tương lai.</p>
        </div>
      `;

      await send({
        to: contactEmail,
        subject: `[Vi Vu Việt Nam] Đơn hàng #${bookingId} đã bị hủy`,
        html,
        tag: 'Cancelled'
      });
    } catch (error) {
      console.error(`[MAIL_ERROR] Lỗi gửi email Cancelled:`, error);
    }
  },

  // Gửi email 4: Hoàn thành đơn (Completed)
  async sendCompletedEmail(bookingId, contactEmail, contactName) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f0f8ff;">
          <h2 style="color: #0068ff; text-align: center;">Chuyến đi của bạn đã hoàn thành!</h2>
          <p>Xin chào <strong>${contactName}</strong>,</p>
          <p>Đơn đặt tour <strong>#${bookingId}</strong> đã được đánh dấu <strong>Hoàn thành</strong>.</p>
          <p>Cảm ơn bạn đã đồng hành cùng Vi Vu Việt Nam. Chúng tôi rất mong nhận được đánh giá và phản hồi từ bạn để ngày càng hoàn thiện hơn.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p style="text-align: center;">
            <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #0068ff; color: #fff; text-decoration: none; border-radius: 5px;">Đánh giá chuyến đi</a>
          </p>
          <p style="color: #888; font-size: 12px; text-align: center;">Nếu nút không hoạt động, bạn có thể phản hồi trực tiếp qua Zalo hoặc Hotline.</p>
        </div>
      `;

      await send({
        to: contactEmail,
        subject: `[Vi Vu Việt Nam] Đơn hàng #${bookingId} đã hoàn thành`,
        html,
        tag: 'Completed'
      });
    } catch (error) {
      console.error(`[MAIL_ERROR] Lỗi gửi email Completed:`, error);
    }
  }
};

module.exports = EmailService;