const express = require('express');
const router = express.Router();

const BookingController = require('../controllers/BookingController');
const { isAuth } = require('../middlewares/auth');


router.use(isAuth);


router.get('/booking/success/:id', BookingController.success);


router.get('/booking/:scheduleId', BookingController.showForm);


router.post('/booking', BookingController.create);


router.get('/my-bookings', BookingController.myBookings);


router.get('/my-bookings/:id', BookingController.bookingDetail);


router.put('/my-bookings/:id/cancel', BookingController.cancel);

module.exports = router;