const bcrypt    = require('bcryptjs');
const UserModel = require('../models/UserModel');
const registerSchema = require('../validators/registerSchema');
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
        ? req.session.save(() => {
          res.redirect('/admin');
          })
        : req.session.save(() => {
          res.redirect('/');
          })

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
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
  const messages = error.details.map(e => e.message);
  req.flash('error', messages);
  return req.session.save(() => {
    res.redirect('/register');
  });
}

    const { fullname, email, password, phone } = req.body;
    
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      req.flash('error', 'Email này đã được đăng ký');
      return res.redirect('/register');
    }

    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await UserModel.create({
      fullname: fullname.trim(),
      email,
      password: hashed,
      phone
    });

    req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
    return req.session.save(() => {
      res.redirect('/login');
});

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