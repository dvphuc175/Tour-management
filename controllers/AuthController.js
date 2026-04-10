const bcrypt    = require('bcryptjs');
const UserModel = require('../models/UserModel');

const AuthController = {
  // GET /login
  showLogin(req, res) {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', { title: 'Đăng nhập' });
  },

  // POST /login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        req.flash('error', 'Email hoặc mật khẩu không đúng');
        return res.redirect('/login');
      }

      if (user.status === 'locked') {
        req.flash('error', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.');
        return res.redirect('/login');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash('error', 'Email hoặc mật khẩu không đúng');
        return res.redirect('/login');
      }

      // Lưu vào session (KHÔNG lưu password)
      req.session.user = {
        id:       user.id,
        fullname: user.fullname,
        email:    user.email,
        role:     user.role
      };

      req.flash('success', `Chào mừng trở lại, ${user.fullname}!`);
      return user.role === 'admin'
        ? res.redirect('/admin')
        : res.redirect('/');

    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: err.message });
    }
  },

  // GET /register
  showRegister(req, res) {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', { title: 'Đăng ký' });
  },

  // POST /register
  async register(req, res) {
    try {
      const { fullname, email, password, confirmPassword, phone } = req.body;

      // Validate cơ bản phía server
      if (password !== confirmPassword) {
        req.flash('error', 'Mật khẩu xác nhận không khớp');
        return res.redirect('/register');
      }
      if (password.length < 6) {
        req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự');
        return res.redirect('/register');
      }

      // Kiểm tra email đã tồn tại chưa
      const existing = await UserModel.findByEmail(email);
      if (existing) {
        req.flash('error', 'Email này đã được đăng ký');
        return res.redirect('/register');
      }

      const hashed = await bcrypt.hash(password, 10);
      await UserModel.create({ fullname, email, password: hashed, phone });

      req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
      res.redirect('/login');

    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: err.message });
    }
  },

  // DELETE /logout  (method-override)
  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
};

module.exports = AuthController;