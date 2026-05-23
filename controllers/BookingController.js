const BookingModel = require('../models/BookingModel');
const ScheduleModel = require('../models/ScheduleModel');
const TourModel = require('../models/TourModel');
const { bookingSchema } = require('../validators/bookingSchema');
const EmailService = require('../services/emailService');
const BookingController = {

  //GET/booking/:scheduleId

  async showForm(req, res, next) {
    try {
      const { scheduleId } = req.params;

      const schedule = await ScheduleModel.findById(scheduleId);

      if (!schedule) {
        req.flash('error', 'Lịch trình không tồn tại');
        return res.redirect('/tours');
      }

      const tour = await TourModel.findById(schedule.tour_id);
      
      if (schedule.status !== 'active' || schedule.available_slots === 0) {
        req.flash('error', 'Lịch trình không còn chỗ hoặc đã bị hủy');
        return res.redirect(tour ? `/tours/${tour.slug}` : '/tours');
      }

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

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const startDate = new Date(schedule.start_date);
      const diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 3) {
        req.flash('error', 'Lịch trình này quá gần ngày khởi hành. Vui lòng chọn lịch trình khác cách ít nhất 3 ngày.');
        return res.redirect(`/tours/${schedule.tour_slug || 'tours'}`);
      }

      const tour = await TourModel.findById(schedule.tour_id);
      const total_price = adults * tour.price_adult + children * tour.price_child;

      const bookingId = await BookingModel.createWithTransaction({
        schedule_id, user_id: req.session.user.id,
        contact_name, contact_phone, contact_email,
        adult_count: adults, child_count: children,
        total_price, special_request, payment_method
      });

      EmailService.sendPendingEmail({
        id: bookingId,
        contact_name: contact_name,
        payment_method: payment_method,
        total_price: total_price
      }, contact_email).catch(console.error);

      if (payment_method === 'vnpay') {
        return res.redirect(`/payment/vnpay/${bookingId}`);
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
      const page = parseInt(req.query.page) || 1;
      const limit = 5;

      const result = await BookingModel.getByUserId(req.session.user.id, page, limit);

      // parse images
      const parsedBookings = result.bookings.map(b => {
        try {
          b.tour_images = JSON.parse(b.tour_images || '[]');
        } catch {
          b.tour_images = [];
        }
        return b;
      });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
          bookings: parsedBookings,
          currentPage: page,
          totalPages: result.totalPages,
          total: result.total
        });
      }

      return res.render('client/my-bookings', {
        title: 'Đơn đặt của tôi',
        bookings: parsedBookings,
        currentPage: page,
        totalPages: result.totalPages,
        total: result.total
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
    const bookingId = req.params.id;
    try {
      const booking = await BookingModel.findByIdAndUser(
        bookingId,
        req.session.user.id
      );

      if (!booking) {
        req.flash('error', 'Không tìm thấy đơn đặt');
      } else {
        await BookingModel.cancelByUser(bookingId, req.session.user.id);

        if (booking.contact_email) {
          EmailService.sendCancelledEmail(
            bookingId,
            booking.contact_email,
            booking.contact_name,
            'Khách hàng yêu cầu hủy'
          ).catch(console.error);
        }

        req.flash('success', 'Đã hủy đơn đặt thành công.');
      }

    } catch (err) {
      req.flash('error', err.message || 'Không thể hủy đơn. Vui lòng thử lại.');
    }

    const referer = req.get('Referer') || '';
    const fromDetail = /\/my-bookings\/\d+(?:[\/?#]|$)/.test(referer);

    return req.session.save(() => {
      res.redirect(fromDetail ? `/my-bookings/${bookingId}` : '/my-bookings');
    });
  }
};

module.exports = BookingController;