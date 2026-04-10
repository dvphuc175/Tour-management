const express = require('express')
const path = require('path');
require('dotenv').config();
require('./config/db');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride= require('method-override');
const MySQLStore = require('express-mysql-session')(session);
const { pool } = require('./config/db');
const app = express()

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
    cookie: { maxAge: 1000 * 60 * 60 * 24 } }));

app.use(flash()); 
app.use((req, res, next) => { 
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error'); 
    res.locals.user = req.session.user || null; 
    res.locals.currentPath = req.path;
    next(); });

//Routes (Sẽ thêm dần từ tuần 2)
app.get('/', (req, res) => {
  res.render('index', { title: 'Trang chủ' });
});

app.get('/admin', (req, res) => {
  res.render('admin/dashboard', {
    title: 'Dashboard',
  });
});

app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
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
  console.log(`✓ Server chạy tại http://localhost:${PORT}`) 
);