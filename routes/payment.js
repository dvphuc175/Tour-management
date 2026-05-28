const express           = require('express');
const router            = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { isAuth, isCustomer } = require('../middlewares/auth');

router.get('/vnpay/return',        PaymentController.vnpayReturn);
router.get('/vnpay/:bookingId',   isAuth, isCustomer, PaymentController.createVnpay);

module.exports = router;
