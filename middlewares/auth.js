const { query } = require('../config/db');

// Yêu cầu đã đăng nhập; đồng thời re-check status/role từ DB phòng admin đổi giữa chừng.
async function isAuth(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
    return res.redirect('/login');
  }

  const rows = await query(
    'SELECT status, role FROM USERS WHERE id = ? LIMIT 1',
    [req.session.user.id]
  );

  if (!rows[0] || rows[0].status === 'locked') {
    req.session.destroy(() => {});
    req.flash('error', 'Tài khoản của bạn đã bị khóa bởi Quản trị viên');
    return res.redirect('/login');
  }

  // Đồng bộ role hiện tại trong DB vào session — admin có thể đổi role mà không cần user logout.
  if (rows[0].role !== req.session.user.role) {
    req.session.user.role = rows[0].role;
  }

  next();
}

// Chỉ admin
function isAdmin(req, res, next) {
  if (req.session.user?.role === 'admin') return next();
  return res.status(403).render('error', { message: 'Không có quyền truy cập' });
}

// Admin hoặc staff (dùng cho khu vực quản lý đơn đặt)
function isStaff(req, res, next) {
  const role = req.session.user?.role;
  if (role === 'admin' || role === 'staff') return next();
  return res.status(403).render('error', { message: 'Không có quyền truy cập' });
}

module.exports = { isAuth, isAdmin, isStaff };
