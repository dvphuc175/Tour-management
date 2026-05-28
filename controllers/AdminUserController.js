const UserModel   = require('../models/UserModel');
const ReviewModel = require('../models/ReviewModel');
 
const VALID_ROLES = ['admin', 'staff', 'customer'];
const VALID_USER_STATUSES = ['active', 'locked'];
const VALID_REVIEW_RATINGS = ['1', '2', '3', '4', '5'];

function normalizeSearch(value) {
  return typeof value === 'string' ? value.trim().slice(0, 100) : '';
}

function buildListUrl(path, filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function getUsersReturnUrl(req) {
  const returnTo = typeof req.body.returnTo === 'string' ? req.body.returnTo : '';
  if (returnTo === '/admin/users' || returnTo.startsWith('/admin/users?')) {
    return returnTo;
  }
  return '/admin/users';
}

const AdminUserController = {
  // GET /admin/users
  async index(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = 10;
      const offset = (page - 1) * limit;
      const filters = {
        q: normalizeSearch(req.query.q),
        role: VALID_ROLES.includes(req.query.role) ? req.query.role : '',
        status: VALID_USER_STATUSES.includes(req.query.status) ? req.query.status : ''
      };

      const [users, total] = await Promise.all([
        UserModel.getAll({ limit, offset, ...filters }),
        UserModel.countAll(filters)
      ]);

      res.render('admin/users/index', {
        title: 'Quản lý người dùng',
        users,
        filters,
        hasFilters: Boolean(filters.q || filters.role || filters.status),
        paginationBaseUrl: buildListUrl('/admin/users', filters),
        returnTo: req.originalUrl,
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        currentPath: req.path
      });
    } catch (err) { next(err); }
  },

  // PUT /admin/users/:id/toggle-status
  async toggleStatus(req, res, next) {
    try {
      const returnTo = getUsersReturnUrl(req);

      if (parseInt(req.params.id, 10) === req.session.user.id) {
        req.flash('error', 'Không thể khóa tài khoản của chính mình');
        return res.redirect(returnTo);
      }

      await UserModel.toggleStatus(req.params.id);

      req.flash('success', 'Đã cập nhật trạng thái tài khoản');
      res.redirect(returnTo);
    } catch (err) { next(err); }
  },

  // PUT /admin/users/:id/role
  async setRole(req, res, next) {
    try {
      const returnTo = getUsersReturnUrl(req);
      const targetId = parseInt(req.params.id, 10);
      const newRole = (req.body.role || '').trim();
 
      if (!VALID_ROLES.includes(newRole)) {
        req.flash('error', 'Vai trò không hợp lệ');
        return res.redirect(returnTo);
      }
 
      if (targetId === req.session.user.id) {
        req.flash('error', 'Không thể tự đổi vai trò của chính mình');
        return res.redirect(returnTo);
      }
 
      const target = await UserModel.findById(targetId);
      if (!target) {
        req.flash('error', 'Không tìm thấy người dùng');
        return res.redirect(returnTo);
      }
 
      if (target.role === newRole) {
        req.flash('info', 'Vai trò không thay đổi');
        return res.redirect(returnTo);
      }
 
      const oldRole = target.role;
      await UserModel.setRole(targetId, newRole);
 
      req.flash(
        'success',
        `Đã đổi vai trò "${target.fullname}" từ ${oldRole} sang ${newRole}. Người dùng cần tải lại trang để áp dụng.`
      );
      res.redirect(returnTo);
    } catch (err) { next(err); }
  },

  // GET /admin/reviews
  async reviewIndex(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = 10;
      const offset = (page - 1) * limit;
      const filters = {
        q: normalizeSearch(req.query.q),
        rating: VALID_REVIEW_RATINGS.includes(String(req.query.rating || '')) ? String(req.query.rating) : ''
      };

      const [reviews, total] = await Promise.all([
        ReviewModel.getAll({ limit, offset, ...filters }),
        ReviewModel.countAll(filters)
      ]);

      res.render('admin/reviews/index', {
        title: 'Quản lý đánh giá',
        reviews,
        filters,
        hasFilters: Boolean(filters.q || filters.rating),
        paginationBaseUrl: buildListUrl('/admin/reviews', filters),
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        currentPath: req.path
      });
    } catch (err) { next(err); }
  }
};

module.exports = AdminUserController;
