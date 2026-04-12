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

    // Regex
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9}$/;

    // Validate fullname
    if (!fullname || fullname.trim() === "") {
      req.flash('error', 'Họ tên không được để trống');
      return res.redirect('/register');
    }

    // Validate email
    if (!emailRegex.test(email)) {
      req.flash('error', 'Email không hợp lệ');
      return res.redirect('/register');
    }

    // Check email tồn tại
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      req.flash('error', 'Email này đã được đăng ký');
      return res.redirect('/register');
    }

    // Validate phone
    if (phone && !phoneRegex.test(phone)) {
      req.flash('error', 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0');
      return res.redirect('/register');
    }
    
    // Validate password
    if (!passwordRegex.test(password)) {
      req.flash('error', 'Mật khẩu phải 8-16 ký tự, gồm chữ và số');
      return res.redirect('/register');
    }

    // Confirm password
    if (password !== confirmPassword) {
      req.flash('error', 'Mật khẩu xác nhận không khớp');
      return res.redirect('/register');
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await UserModel.create({
      fullname: fullname.trim(),
      email,
      password: hashed,
      phone
    });

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