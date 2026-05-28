const express = require('express');
const router = express.Router();

const BookingController = require('../controllers/BookingController');
const { isAuth, isCustomer } = require('../middlewares/auth');


router.get('/booking/success/:id', isAuth, isCustomer, BookingController.success);


router.get('/booking/:scheduleId', isAuth, isCustomer, BookingController.showForm);


router.post('/booking', isAuth, isCustomer, BookingController.create);


router.get('/my-bookings', isAuth, isCustomer, BookingController.myBookings);


router.get('/my-bookings/:id', isAuth, isCustomer, BookingController.bookingDetail);


router.put('/my-bookings/:id/cancel', isAuth, isCustomer, BookingController.cancel);


module.exports = router;
