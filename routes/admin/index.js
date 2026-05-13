const express    = require('express');
const router     = express.Router();
const { isAuth, isAdmin, isStaff } = require('../../middlewares/auth');
const AdminDashboardController = require('../../controllers/AdminDashboardController');

// Mọi route /admin yêu cầu đã đăng nhập trước; mỗi sub-route tự gắn isAdmin hoặc isStaff.
router.use(isAuth);

// Dashboard — staff cũng xem được 
router.get('/', isStaff,  AdminDashboardController.index)

// Quản lý đơn đặt: admin + staff
router.use('/bookings', isStaff, require('./bookings'));
 
// Các phần còn lại: chỉ admin
router.use('/categories', isAdmin, require('./categories'));
router.use('/tours',      isAdmin, require('./tours'));
router.use('/schedules',  isAdmin, require('./schedules'));
router.use('/users',      isAdmin, require('./users'));
router.use('/reviews',    isAdmin, require('./reviews'));
router.get('/reports', isAdmin, AdminDashboardController.reports);
module.exports = router;