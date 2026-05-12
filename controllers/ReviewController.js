const ReviewModel = require('../models/ReviewModel');
const TourModel = require('../models/TourModel');

// Express 5 đã bỏ res.redirect('back'); helper này thay thế tương đương an toàn.
function redirectBack(req, res, fallback = '/') {
  return res.redirect(req.get('Referer') || fallback);
}

const ReviewController = {
  // POST /reviews
  async create(req, res, next) {
    try {
      const { tour_id, rating, comment } = req.body;
      const userId = req.session.user.id;

      const r = parseInt(rating);

      // Kiểm tra rating hợp lệ
      if (!r || r < 1 || r > 5) {
        req.flash('error', 'Vui lòng chọn số sao từ 1 đến 5');
        return redirectBack(req, res);
      }

      // Chỉ cho review khi đã hoàn thành tour
      const canReview = await ReviewModel.hasCompletedBooking(
        userId,
        tour_id
      );

      if (!canReview) {
        req.flash('error', 'Bạn cần hoàn thành tour trước khi đánh giá');
        return redirectBack(req, res);
      }

      // Mỗi user chỉ được review 1 lần cho mỗi tour
      const alreadyReviewed = await ReviewModel.hasReviewed(
        userId,
        tour_id
      );

      if (alreadyReviewed) {
        req.flash('error', 'Bạn đã đánh giá tour này rồi');
        return redirectBack(req, res);
      }

      // Tạo review
      await ReviewModel.create({
        tour_id,
        user_id: userId,
        rating: r,
        comment
      });

      // Lấy thông tin tour để redirect
      const tour = await TourModel.findById(tour_id);

      req.flash('success', 'Cảm ơn bạn đã đánh giá!');

      return res.redirect(`/tours/${tour.slug}#reviews`);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /admin/reviews/:id
  async adminDelete(req, res, next) {
    try {
      await ReviewModel.delete(req.params.id);

      req.flash('success', 'Đã xóa đánh giá');

      return redirectBack(req, res, '/admin/reviews');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReviewController;