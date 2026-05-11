const UserModel   = require('../models/UserModel');
const ReviewModel = require('../models/ReviewModel');

const AdminUserController = {
  // GET /admin/users
  async index(req, res, next) {
    try {
      const users = await UserModel.getAll();
      res.render('admin/users/index', {
        title: 'Quản lý người dùng', users, currentPath: req.path
      });
    } catch (err) { next(err); }
  },

  // PUT /admin/users/:id/toggle-status
  async toggleStatus(req, res, next) {
    try {
      if (parseInt(req.params.id) === req.session.user.id) {
        req.flash('error', 'Không thể khóa tài khoản của chính mình');
        return res.redirect('/admin/users');
      }
      // Lưu ý: Đảm bảo trong UserModel của bạn có hàm toggleStatus nhé!
      await UserModel.toggleStatus(req.params.id); 
      req.flash('success', 'Đã cập nhật trạng thái tài khoản');
      res.redirect('/admin/users');
    } catch (err) { next(err); }
  },

  // GET /admin/reviews
  async reviewIndex(req, res, next) {
    try {
      const reviews = await ReviewModel.getAll();
      res.render('admin/reviews/index', {
        title: 'Quản lý đánh giá', reviews, currentPath: req.path
      });
    } catch (err) { next(err); }
  }
};

module.exports = AdminUserController;