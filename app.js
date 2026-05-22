const express = require('express')
const path = require('path');
require('dotenv').config();
require('./cron');
require('./config/db');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride= require('method-override');
const sanitizeHtml = require('sanitize-html');
const MySQLStore = require('express-mysql-session')(session);
const { pool } = require('./config/db');
const { csrf } = require('./middlewares/csrf');
const bookingStatus = require('./utils/bookingStatus');
const app = express()

const FLASH_DEFAULTS = {
  success: { title: 'Thành công', icon: 'check' },
  error: { title: 'Không thể thực hiện', icon: 'warning' },
  info: { title: 'Thông báo', icon: 'info' }
};

function normalizeFlashMessage(type, value) {
  const defaults = FLASH_DEFAULTS[type] || FLASH_DEFAULTS.info;

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      type,
      title: value.title || defaults.title,
      message: value.message || value.text || '',
      details: Array.isArray(value.details) ? value.details : [],
      icon: value.icon || defaults.icon,
      action: value.action || null,
      actions: Array.isArray(value.actions) ? value.actions : []
    };
  }

  return {
    type,
    title: defaults.title,
    message: String(value || ''),
    details: [],
    icon: defaults.icon,
    action: null,
    actions: []
  };
}

function collectFlashMessages(req) {
  return ['success', 'info', 'error'].flatMap((type) =>
    req.flash(type).map((msg) => normalizeFlashMessage(type, msg))
  );
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
//Thiết lập views
app.set('views', path.join(__dirname,"views"))
app.set('view engine', 'pug')

//Thiết lập thư mục chứa file tĩnh của Frontend
app.use(express.static(path.join(__dirname,"public")))

//Body parser
app.use(express.urlencoded({ extended: true })); app.use(express.json());

//Method override (PUT/DELETE từ form HTML) 
app.use(methodOverride('_method'));

//Session lưu vào MySQL 
const sessionStore = new MySQLStore({}, pool); 
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    store: sessionStore, 
        cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(flash());
app.use((req, res, next) => {
  const redirect = res.redirect.bind(res);
  const render = res.render.bind(res);

  res.locals.success = [];
  res.locals.error = [];
  res.locals.info = [];
  res.locals.flashMessages = [];
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;

  res.redirect = (...args) => {
    if (!req.session || typeof req.session.save !== 'function') {
      return redirect(...args);
    }

    return req.session.save((err) => {
      if (err) return next(err);
      return redirect(...args);
    });
  };

  res.render = (...args) => {
    res.locals.flashMessages = collectFlashMessages(req);
    return render(...args);
  };

  next();
});
app.use(csrf);
app.use((req, res, next) => { 
    res.locals.user = req.session.user || null; 
    res.locals.currentPath = req.path;

    // Tạo helper cleanHtml để dùng trong Pug
  res.locals.cleanHtml = (html) => {
    if (!html) return '';
    return sanitizeHtml(html, {
      allowedTags: [
        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        // Text formatting
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 's', 'del',
        // Lists
        'ul', 'ol', 'li',
        // Links
        'a',
        // Block elements
        'blockquote', 'div', 'span', 'hr',
        // Tables
        'table', 'thead', 'tbody', 'tr', 'td', 'th',
        // Media
        'img', 'figure', 'figcaption',
        // Section markers (HTML comments handled separately)
      ],
      allowedAttributes: {
        'a': ['href', 'name', 'target', 'rel', 'title'],
        'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'class'],
        'div': ['class', 'id'],
        'span': ['class', 'style'],
        'p': ['class'],
        'h1': ['class'], 'h2': ['class'], 'h3': ['class'], 'h4': ['class'], 'h5': ['class'], 'h6': ['class'],
        'ul': ['class'], 'ol': ['class'], 'li': ['class'],
        'table': ['class'], 'thead': ['class'], 'tbody': ['class'], 'tr': ['class'], 'td': ['class', 'colspan', 'rowspan'], 'th': ['class', 'colspan', 'rowspan']
      },
      // Preserve HTML comments (section markers like <!-- SECTION:overview -->)
      allowComments: true
    });
  };

    // Helper dùng trong tất cả Pug: #{formatPrice(tour.price_adult)}
  res.locals.formatPrice = (n) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(n);

  // Helper format ngày: #{formatDate(schedule.start_date)}
  res.locals.formatDate = (d) =>
    new Date(d).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  res.locals.renderStars = (rating) => {
    const r = Math.min(5, Math.max(0, Number(rating) || 0));
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    for (let i = 0; i < full; i++) {
      html += '<i class="fa-solid fa-star stars-fa stars-fa--full" aria-hidden="true"></i>';
    }
    if (half) {
      html += '<i class="fa-solid fa-star-half-stroke stars-fa stars-fa--half" aria-hidden="true"></i>';
    }
    for (let i = 0; i < empty; i++) {
      html += '<i class="fa-regular fa-star stars-fa stars-fa--empty" aria-hidden="true"></i>';
    }
    return html;
  };
  res.locals.renderStarRating = (rating) => {
    const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += i <= n
        ? '<i class="fa-solid fa-star stars-fa stars-fa--full" aria-hidden="true"></i>'
        : '<i class="fa-regular fa-star stars-fa stars-fa--empty" aria-hidden="true"></i>';
    }
    return html;
  };
  res.locals.bookingStatus = bookingStatus;
    next(); });

app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/booking'));
app.use('/payment',    require('./routes/payment'));
app.use('/', require('./routes/client'));
//404 handler
app.use((req, res) => { 
  res.status(404).render('404', { title: 'Không tìm thấy trang' }); 
});
//Error handler
app.use((err, req, res, next) => { 
  console.error(err.stack); res.status(500).render('error', { message: err.message }); 
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => 
  console.log(`Server chạy tại http://localhost:${PORT}`) 
);
