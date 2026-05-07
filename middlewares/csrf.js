const crypto = require('crypto');
 
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
 
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}
 
function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
 
/**
 * Middleware CSRF dựa trên session.
 * - Sinh token gắn vào req.session.csrfToken (cố định trong vòng đời session).
 * - Đẩy token ra res.locals.csrfToken để các view (Pug) chèn vào hidden input.
 * - Bỏ qua các method an toàn (GET/HEAD/OPTIONS).
 * - Với form thường: token đọc từ req.body._csrf (cần body-parser chạy trước).
 * - Với form multipart (multer chạy ở route-level, body chưa parse khi middleware này chạy):
 *   gắn token vào URL query (?_csrf=...) — middleware sẽ đọc từ req.query._csrf.
 * - Hỗ trợ thêm header X-CSRF-Token / CSRF-Token cho các lời gọi AJAX.
 */
function csrf(req, res, next) {
  if (!req.session) {
    return next(new Error('CSRF middleware requires session middleware to be configured'));
  }
 
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateToken();
  }
  res.locals.csrfToken = req.session.csrfToken;
 
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }
 
  const submitted =
    (req.body && req.body._csrf) ||
    (req.query && req.query._csrf) ||
    req.get('x-csrf-token') ||
    req.get('csrf-token');
 
  if (!timingSafeEqualString(submitted, req.session.csrfToken)) {
    res.status(403);
    return res.render('error', {
      message: 'Phiên không hợp lệ hoặc đã hết hạn. Vui lòng tải lại trang và thử lại.'
    });
  }
  
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, '_csrf')) {
    delete req.body._csrf;
  }
  if (req.query && Object.prototype.hasOwnProperty.call(req.query, '_csrf')) {
    delete req.query._csrf;
  }
 
  return next();
}
 
module.exports = { csrf, generateToken };