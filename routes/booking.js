const express = require('express');
const router = express.Router();

const BookingController = require('../controllers/BookingController');
const { isAuth } = require('../middlewares/auth');


router.get('/booking/success/:id', isAuth, BookingController.success);


router.get('/booking/:scheduleId', isAuth, BookingController.showForm);


router.post('/booking', isAuth, BookingController.create);


router.get('/my-bookings', isAuth, BookingController.myBookings);


router.get('/my-bookings/:id', isAuth, BookingController.bookingDetail);


router.put('/my-bookings/:id/cancel', isAuth, BookingController.cancel);


module.exports = router;