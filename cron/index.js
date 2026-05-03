const cron = require('node-cron');
const BookingModel = require('../models/BookingModel');

cron.schedule('* * * * *', async () => {
  try {
    const canceledCount = await BookingModel.autoCancelUnpaidVnpay();
    if (canceledCount > 0) {
      console.log(`[CRON] Đã hủy tự động ${canceledCount} đơn VNPay quá 15 phút và hoàn trả chỗ.`);
    }
  } catch (error) {
    console.error('[CRON] Lỗi khi chạy tác vụ dọn dẹp đơn VNPay:', error);
  }
});