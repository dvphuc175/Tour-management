const cron = require('node-cron');
const BookingModel = require('../models/BookingModel');

cron.schedule('* * * * *', async () => {
  try {
    // Quét VNPay (15 phút)
    const canceledVnpay = await BookingModel.autoCancelUnpaidVnpay();
    if (canceledVnpay > 0) {
      console.log(`[CRON] Đã hủy tự động ${canceledVnpay} đơn VNPay (quá 15 phút).`);
    }

    // Quét Tiền mặt (24 giờ)
    const canceledCash = await BookingModel.autoCancelUnpaidCash();
    if (canceledCash > 0) {
      console.log(`[CRON] Đã hủy tự động ${canceledCash} đơn Tiền mặt (quá 24 giờ).`);
    }
  } catch (error) {
    console.error('[CRON] Lỗi khi chạy tác vụ dọn dẹp:', error);
  }
});