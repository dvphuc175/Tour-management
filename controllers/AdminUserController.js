const UserModel   = require('../models/UserModel');
const ReviewModel = require('../models/ReviewModel');
 
const VALID_ROLES = ['admin', 'staff', 'customer'];
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

      await UserModel.toggleStatus(req.params.id);
      const target = await UserModel.findById(req.params.id);

      req.flash('success', 'Đã cập nhật trạng thái tài khoản');
      res.redirect('/admin/users');
    } catch (err) { next(err); }
  },

  // PUT /admin/users/:id/role
  async setRole(req, res, next) {
    try {
      const targetId = parseInt(req.params.id);
      const newRole = (req.body.role || '').trim();
 
      if (!VALID_ROLES.includes(newRole)) {
        req.flash('error', 'Vai trò không hợp lệ');
        return res.redirect('/admin/users');
      }
 
      if (targetId === req.session.user.id) {
        req.flash('error', 'Không thể tự đổi vai trò của chính mình');
        return res.redirect('/admin/users');
      }
 
      const target = await UserModel.findById(targetId);
      if (!target) {
        req.flash('error', 'Không tìm thấy người dùng');
        return res.redirect('/admin/users');
      }
 
      if (target.role === newRole) {
        req.flash('info', 'Vai trò không thay đổi');
        return res.redirect('/admin/users');
      }
 
      const oldRole = target.role;
      await UserModel.setRole(targetId, newRole);
 
      req.flash(
        'success',
        `Đã đổi vai trò "${target.fullname}" từ ${oldRole} sang ${newRole}. Người dùng cần tải lại trang để áp dụng.`
      );
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