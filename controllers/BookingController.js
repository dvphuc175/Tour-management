const BookingModel = require('../models/BookingModel');
const ScheduleModel = require('../models/ScheduleModel');
const TourModel = require('../models/TourModel');
const { bookingSchema } = require('../validators/bookingSchema');
const BookingController = {

  //GET/booking/:scheduleId

  async showForm(req, res, next) {
    try {
      const { scheduleId } = req.params;

      const schedule = await ScheduleModel.findById(scheduleId);
      const tour = await TourModel.findById(schedule.tour_id);
      
      if (!schedule || schedule.status !== 'active' || schedule.available_slots === 0) {
        req.flash('error', 'Lịch trình không còn chỗ hoặc đã bị hủy');
        return res.redirect(`/tours/${tour.slug}`);
      }

      //const tour = await TourModel.findById(schedule.tour_id);

      return res.render('client/booking-form', {
        title: `Đặt tour: ${tour.name}`,
        tour,
        schedule,
        prefill: {
          contact_name: req.session.user.fullname,
          contact_email: req.session.user.email
        }
      });

    } catch (err) {
      next(err);
    }
  },

  //POST /booking
  async create(req, res, next) {
    try {
      const { error, value } = bookingSchema.validate(req.body, { abortEarly: true });

      if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect(`/booking/${req.body.schedule_id || ''}`);
      }

      const { 
        schedule_id, contact_name, contact_phone, contact_email,
        adult_count: adults, child_count: children, 
        special_request, payment_method 
      } = value;

      const schedule = await ScheduleModel.findById(schedule_id);
      if (!schedule) {
        req.flash('error', 'Lịch trình không tồn tại');
        return res.redirect('/tours');
      }
      
      const tour = await TourModel.findById(schedule.tour_id);
      const total_price = adults * tour.price_adult + children * tour.price_child;

      const bookingId = await BookingModel.createWithTransaction({
        schedule_id, user_id: req.session.user.id,
        contact_name, contact_phone, contact_email,
        adult_count: adults, child_count: children,
        total_price, special_request, payment_method
      });

      if (payment_method === 'vnpay') {
        return res.redirect(`my-bookings/${bookingId}`);
      } else {
        req.flash('success', 'Đặt tour thành công! Vui lòng chờ xác nhận.');
        return res.redirect(`/booking/success/${bookingId}`);
      }

    } catch (err) {
      req.flash('error', err.message);
      const backUrl = req.body.schedule_id ? `/booking/${req.body.schedule_id}` : '/tours';
      res.redirect(backUrl);
    }
  },

  // GET /booking/success/:id
  async success(req, res, next) {
    try {
      const booking = await BookingModel.findByIdAndUser(
        req.params.id,
        req.session.user.id
      );

      if (!booking) {
        return res.redirect('/my-bookings');
      }

      return res.render('client/booking-success', {
        title: 'Đặt tour thành công',
        booking
      });

    } catch (err) {
      next(err);
    }
  },

  // GET /my-bookings
  async myBookings(req, res, next) {
    try {
      const bookings = await BookingModel.getByUserId(req.session.user.id);

      // parse images
      const parsedBookings = bookings.map(b => {
        try {
          b.tour_images = JSON.parse(b.tour_images || '[]');
        } catch {
          b.tour_images = [];
        }
        return b;
      });

      return res.render('client/my-bookings', {
        title: 'Đơn đặt của tôi',
        bookings: parsedBookings
      });

    } catch (err) {
      next(err);
    }
  },

  //GET /my-bookings/:id
  async bookingDetail(req, res, next) {
    try {
      const booking = await BookingModel.findByIdAndUser(
        req.params.id,
        req.session.user.id
      );

      if (!booking) {
        req.flash('error', 'Không tìm thấy đơn đặt');
        return res.redirect('/my-bookings');
      }

      return res.render('client/booking-detail', {
        title: `Đơn #${booking.id}`,
        booking
      });

    } catch (err) {
      next(err);
    }
  },

  // PUT /my-bookings/:id/cancel
  async cancel(req, res, next) {
    try {
      await BookingModel.cancelByUser(
        req.params.id,
        req.session.user.id
      );

      req.flash('success', 'Đã hủy đơn đặt');

    } catch (err) {
      req.flash('error', err.message);
    }

    return res.redirect('/my-bookings');
  }
};

module.exports = BookingController;