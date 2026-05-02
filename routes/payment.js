const express           = require('express');
const router            = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { isAuth }        = require('../middlewares/auth');

router.get('/vnpay/return',        PaymentController.vnpayReturn);
router.get('/vnpay/:bookingId',   isAuth, PaymentController.createVnpay);

module.exports = router;