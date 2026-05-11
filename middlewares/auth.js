const { query } = require('../config/db');
async function isAuth(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Vui lòng đăng nhập để tiếp tục');
    return res.redirect('/login');
  }
  
  // Kiểm tra DB — phòng trường hợp admin khóa sau khi user đã login
  const rows = await query(
    'SELECT status FROM USERS WHERE id = ? LIMIT 1',
    [req.session.user.id]
  );
  
  if (!rows[0] || rows[0].status === 'locked') {
    req.session.destroy(() => {}); // Hủy phiên đăng nhập
    req.flash('error', 'Tài khoản của bạn đã bị khóa bởi Quản trị viên');
    return res.redirect('/login');
  }
  
  next();
}
function isAdmin(req, res, next) { 
    if (req.session.user?.role === 'admin') 
        return next(); res.status(403).render('error', { message: 'Không có quyền truy cập' }); 
} 
module.exports = { isAuth, isAdmin };