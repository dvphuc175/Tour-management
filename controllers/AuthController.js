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
        req.flash('error', {
          title: 'Đăng nhập thất bại',
          message: 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.',
          icon: 'warning'
        });
        return res.redirect('/login');
      }

      if (user.status === 'locked') {
        req.flash('error', {
          title: 'Tài khoản đã bị khóa',
          message: 'Vui lòng liên hệ bộ phận hỗ trợ để được kiểm tra và mở lại tài khoản.',
          icon: 'warning',
          action: { label: 'Liên hệ hỗ trợ', href: '/#contact' }
        });
        return res.redirect('/login');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash('error', {
          title: 'Đăng nhập thất bại',
          message: 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.',
          icon: 'warning'
        });
        return res.redirect('/login');
      }

      req.session.user = {
        id:       user.id,
        fullname: user.fullname,
        email:    user.email,
        role:     user.role
      };

      req.flash('success', {
        title: `Chào mừng trở lại, ${user.fullname}!`,
        message: user.role === 'admin' || user.role === 'staff'
          ? 'Bạn sẽ được chuyển đến khu vực quản trị.'
          : 'Bạn đã đăng nhập thành công và có thể tiếp tục đặt tour.',
        icon: 'user'
      });
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      
      return req.session.save(() => {
        if (user.role === 'admin' || user.role === 'staff') {
          res.redirect('/admin');
        } else if (returnTo) {
          res.redirect(returnTo);
        } else {
          res.redirect('/');
        }
      });

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
  req.flash('error', {
    title: 'Đăng ký chưa hoàn tất',
    message: 'Vui lòng kiểm tra lại các thông tin bên dưới.',
    icon: 'warning',
    details: messages
  });
  return req.session.save(() => {
    res.redirect('/register');
  });
}

    const { fullname, email, password, phone } = req.body;
    
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      req.flash('error', {
        title: 'Email đã tồn tại',
        message: 'Email này đã được đăng ký. Bạn có thể đăng nhập hoặc dùng email khác.',
        icon: 'warning',
        action: { label: 'Đăng nhập', href: '/login' }
      });
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

    req.flash('success', {
      title: 'Đăng ký thành công',
      message: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để bắt đầu đặt tour.',
      icon: 'check'
    });
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