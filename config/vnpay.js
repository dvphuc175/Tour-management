const { VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
  tmnCode:       process.env.VNPAY_TMN_CODE,
  secureSecret:  process.env.VNPAY_HASH_SECRET,
  vnpayHost:     'https://sandbox.vnpayment.vn',
  testMode:      process.env.NODE_ENV !== 'production',
  enableLog:     false,
  loggerFn:      ignoreLogger
});

module.exports = vnpay;