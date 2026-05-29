const ReviewModel = require('../models/ReviewModel');
const TourModel = require('../models/TourModel');
const { reviewSchema } = require('../validators/reviewSchema');

function redirectBack(req, res, fallback = '/') {
  return res.redirect(req.get('Referer') || fallback);
}

const ReviewController = {
  // POST /reviews
  async create(req, res, next) {
    try {
      const userId = req.session.user.id;

      // 1. Validate input bằng Joi
      const { error, value } = reviewSchema.validate(req.body, { abortEarly: true });
      if (error) {
        req.flash('error', {
          title: 'Chưa thể gửi đánh giá',
          message: error.details[0].message,
          icon: 'warning'
        });
        return redirectBack(req, res);
      }

      const { tour_id, rating, comment } = value;
      const tour = await TourModel.findById(tour_id);

      if (!tour) {
        req.flash('error', 'Không tìm thấy tour');
        return redirectBack(req, res);
      }
 
      // 2. Chỉ cho review khi đã hoàn thành tour
      const canReview = await ReviewModel.hasCompletedBooking(userId, tour_id);

      if (!canReview) {
        req.flash('error', {
          title: 'Chưa thể đánh giá tour',
          message: 'Bạn cần hoàn thành tour trước khi gửi đánh giá.',
          icon: 'warning',
          action: { label: 'Xem đơn của tôi', href: '/my-bookings' }
        });
        return redirectBack(req, res);
      }

      // 3. Mỗi user chỉ được review 1 lần cho mỗi tour
      const alreadyReviewed = await ReviewModel.hasReviewed(userId, tour_id);

      if (alreadyReviewed) {
        req.flash('info', {
          title: 'Bạn đã đánh giá tour này',
          message: 'Mỗi tài khoản chỉ có thể gửi một đánh giá cho mỗi tour.',
          icon: 'info'
        });
        return redirectBack(req, res);
      }

      // 4. Tạo review (UNIQUE(tour_id, user_id) ở DB là tuyến phòng cuối cho race condition)
      try {
        await ReviewModel.create({ tour_id, user_id: userId, rating, comment });
      } catch (err) {
        if (err && err.code === 'ER_DUP_ENTRY') {
          req.flash('info', {
            title: 'Bạn đã đánh giá tour này',
            message: 'Mỗi tài khoản chỉ có thể gửi một đánh giá cho mỗi tour.',
            icon: 'info'
          });
          return redirectBack(req, res);
        }
        throw err;
      }

      req.flash('success', {
        title: 'Cảm ơn bạn đã đánh giá',
        message: 'Nhận xét của bạn đã được ghi nhận và sẽ hiển thị trong danh sách đánh giá.',
        icon: 'star'
      });

      return res.redirect(`/tours/${tour.slug}#reviews`);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /admin/reviews/:id
  async adminDelete(req, res, next) {
    try {
      const result = await ReviewModel.delete(req.params.id);

      if (!result.affectedRows) {
        req.flash('error', 'Không tìm thấy đánh giá');
        return redirectBack(req, res, '/admin/reviews');
      }

      req.flash('success', {
        title: 'Đã xóa đánh giá',
        message: 'Đánh giá đã được gỡ khỏi hệ thống.',
        icon: 'check'
      });

      return redirectBack(req, res, '/admin/reviews');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReviewController;