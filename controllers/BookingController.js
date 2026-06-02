const BookingModel = require('../models/BookingModel');
const ScheduleModel = require('../models/ScheduleModel');
const TourModel = require('../models/TourModel');
const { bookingSchema } = require('../validators/bookingSchema');
const EmailService = require('../services/emailService');
const bookingStatus = require('../utils/bookingStatus');
const {
  BOOKING_LEAD_TIME_MESSAGE,
  isBookableStartDate
} = require('../utils/bookingPolicy');
const BookingController = {

  //GET/booking/:scheduleId

  async showForm(req, res, next) {
    try {
      const { scheduleId } = req.params;

      const schedule = await ScheduleModel.findById(scheduleId);

      if (!schedule) {
        req.flash('error', {
          title: 'Không tìm thấy lịch trình',
          message: 'Lịch trình bạn chọn không còn tồn tại.',
          icon: 'warning'
        });
        return res.redirect('/tours');
      }

      const tour = await TourModel.findById(schedule.tour_id);
      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return res.redirect('/tours');
      }
      
      if (schedule.status !== 'active' || schedule.available_slots <= 0) {
        req.flash('error', {
          title: 'Lịch trình không khả dụng',
          message: 'Lịch trình này không còn chỗ hoặc đã bị hủy.',
          icon: 'warning'
        });
        return res.redirect(tour ? `/tours/${tour.slug}` : '/tours');
      }

      if (!isBookableStartDate(schedule.start_date)) {
        req.flash('error', {
          title: 'Ngày khởi hành quá gần',
          message: BOOKING_LEAD_TIME_MESSAGE,
          icon: 'warning'
        });
        return res.redirect(`/tours/${tour.slug}`);
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
        req.flash('error', {
          title: 'Thông tin đặt tour chưa hợp lệ',
          message: error.details[0].message,
          icon: 'warning'
        });
        return res.redirect(`/booking/${req.body.schedule_id || ''}`);
      }

      const { 
        schedule_id, contact_name, contact_phone, contact_email,
        adult_count: adults, child_count: children, 
        special_request, payment_method 
      } = value;

      const schedule = await ScheduleModel.findById(schedule_id);
      if (!schedule) {
        req.flash('error', {
          title: 'Không tìm thấy lịch trình',
          message: 'Lịch trình bạn chọn không còn tồn tại.',
          icon: 'warning'
        });
        return res.redirect('/tours');
      }

      const tour = await TourModel.findById(schedule.tour_id);
      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return res.redirect('/tours');
      }

      if (schedule.status !== 'active' || schedule.available_slots <= 0) {
        req.flash('error', {
          title: 'Lịch trình không khả dụng',
          message: 'Lịch trình này không còn chỗ hoặc đã bị hủy.',
          icon: 'warning'
        });
        return res.redirect(`/tours/${tour.slug}`);
      }

      if (!isBookableStartDate(schedule.start_date)) {
        req.flash('error', {
          title: 'Ngày khởi hành quá gần',
          message: BOOKING_LEAD_TIME_MESSAGE,
          icon: 'warning'
        });
        return res.redirect(`/tours/${tour.slug}`);
      }

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
        req.flash('success', {
          title: 'Đặt tour thành công',
          message: `Đơn #${bookingId} đã được ghi nhận. Vui lòng chờ nhân viên xác nhận thanh toán tiền mặt.`,
          icon: 'receipt'
        });
        return res.redirect(`/booking/success/${bookingId}`);
      }

    } catch (err) {
      const publicMessage =
        err.message === 'Lịch trình không tồn tại' ||
        err.message === 'Lịch trình không tồn tại hoặc đã bị hủy' ||
        err.message === BOOKING_LEAD_TIME_MESSAGE ||
        (err.message && err.message.startsWith('Không đủ chỗ'))
          ? err.message
          : 'Không thể tạo đơn đặt tour lúc này. Vui lòng thử lại sau.';
      req.flash('error', {
        title: 'Không thể tạo đơn đặt tour',
        message: publicMessage,
        icon: 'warning'
      });
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
        return bookingStatus.decorateBooking(b);
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
        req.flash('error', {
          title: 'Không tìm thấy đơn đặt',
          message: 'Đơn đặt này không tồn tại hoặc không thuộc tài khoản của bạn.',
          icon: 'warning'
        });
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
        req.flash('error', {
          title: 'Không tìm thấy đơn đặt',
          message: 'Đơn đặt này không tồn tại hoặc không thuộc tài khoản của bạn.',
          icon: 'warning'
        });
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

        req.flash('success', {
          title: 'Đã hủy đơn đặt',
          message: `Đơn #${bookingId} đã được hủy và số chỗ đã được hoàn lại cho lịch trình.`,
          icon: 'check'
        });
      }

    } catch (err) {
      const publicMessage = ['Không tìm thấy đơn đặt', 'Chỉ được hủy đơn đang chờ'].includes(err.message)
        ? err.message
        : 'Không thể hủy đơn lúc này. Vui lòng thử lại sau.';
      req.flash('error', {
        title: 'Không thể hủy đơn',
        message: publicMessage,
        icon: 'warning'
      });
    }

    const referer = req.get('Referer') || '';
    const fromDetail = /\/my-bookings\/\d+(?:[\/?#]|$)/.test(referer);

    return req.session.save(() => {
      res.redirect(fromDetail ? `/my-bookings/${bookingId}` : '/my-bookings');
    });
  }
};

module.exports = BookingController;
